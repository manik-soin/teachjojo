import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SessionChat, type ChatTurn } from "@/components/teach-jojo/session-chat";
import { requireUserId } from "@/lib/auth/user";
import { resolveModel } from "@/lib/jojo/model";
import { splitBubbles } from "@/lib/jojo/prompt";
import { listSessionsForUser } from "@/lib/sessions/repo";
import { loadSession, SessionError, toObjectives } from "@/lib/sessions/service";
import { toRail } from "@/lib/sessions/rail";

type Params = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";
// End Session runs the review model call through a server action on this route; give it the same budget as the chat API.
export const maxDuration = 60;
export const metadata: Metadata = { title: "Teach Jojo" };

export default async function SessionPage({ params }: Params) {
  const { id } = await params;
  const userId = await requireUserId();

  let b: Awaited<ReturnType<typeof loadSession>>;
  try {
    b = await loadSession(id, userId);
  } catch (e) {
    if (e instanceof SessionError && e.code === "not_found") notFound();
    throw e;
  }
  const rail = toRail(await listSessionsForUser(userId));

  const tagByMessage = new Map(b.tags.map((t) => [t.messageId, { value: t.tag, reason: t.reason, quotes: t.quotes ?? [] }]));
  const turns: ChatTurn[] = b.messages.map((m) => ({
    id: m.id,
    turnIndex: m.turnIndex,
    role: m.role,
    bubbles: m.role === "assistant" ? splitBubbles(m.content) : [m.content],
    tag: tagByMessage.get(m.id) ?? null,
  }));

  return (
    <SessionChat
      sessionId={b.session.id}
      subjectName={b.session.subjectName}
      objectives={toObjectives(b.objectives)}
      initialTurns={turns}
      initialHelp={b.help.map((h) => ({ id: h.id, role: h.role, content: h.content }))}
      turnsUsed={b.session.turnsUsed}
      maxTurns={b.session.maxTurns}
      confidence={b.session.confidence}
      status={b.session.status}
      startedAt={b.session.startedAt.toISOString()}
      completedAt={b.session.completedAt?.toISOString() ?? null}
      demo={resolveModel().isMock}
      rail={rail}
    />
  );
}
