import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/user";
import { jojoTurnInput } from "@/lib/jojo/contract";
import { takeTurn } from "@/lib/sessions/service";
import { errorResponse } from "../_errors";

export const maxDuration = 60;

/**
 * Same path as the original product's chat endpoint. One student turn in, one Jojo turn out.
 *
 * With `Accept: application/x-ndjson` the reply streams: `{"type":"partial","bubbles":[...]}`
 * lines as Jojo's text grows, then one `{"type":"final",...JojoTurnResponse}` once the
 * structured object has been validated and committed, or `{"type":"error","message"}`.
 * Plain JSON callers (the eval, scripts) get the final object only.
 */
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const parsed = jojoTurnInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid", issues: parsed.error.issues }, { status: 400 });

  const wantsStream = request.headers.get("accept")?.includes("application/x-ndjson");
  if (!wantsStream) {
    try {
      return NextResponse.json(await takeTurn({ userId, ...parsed.data }));
    } catch (error) {
      return errorResponse(error);
    }
  }

  const encoder = new TextEncoder();
  // A client that disconnects mid-stream must not abort the turn: the model call and the commit run to
  // completion so the student finds the reply on reload, and nothing is written to the closed stream.
  let closed = false;
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(obj)}\n`));
        } catch {
          closed = true;
        }
      };
      try {
        const final = await takeTurn({ userId, ...parsed.data }, (bubbles) => send({ type: "partial", bubbles }));
        send({ type: "final", ...final });
      } catch (error) {
        const res = errorResponse(error);
        const body = (await res.json()) as { message?: string; error?: string };
        send({ type: "error", status: res.status, code: body.error, message: body.message ?? "Jojo got confused. Try that again." });
      } finally {
        if (!closed) {
          closed = true;
          try {
            controller.close();
          } catch {
            /* already closed by the client */
          }
        }
      }
    },
    cancel() {
      closed = true;
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
