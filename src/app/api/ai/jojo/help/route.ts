import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/user";
import { helpInput } from "@/lib/jojo/contract";
import { askForHelp } from "@/lib/sessions/service";
import { errorResponse } from "../../_errors";

export const maxDuration = 60;

/** The side "Ask for help" chat with grown-up Jojo. Kept separate from the main transcript, as in the original. */
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const parsed = helpInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid", issues: parsed.error.issues }, { status: 400 });

  try {
    return NextResponse.json(await askForHelp({ userId, ...parsed.data }));
  } catch (error) {
    return errorResponse(error);
  }
}
