import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewScreen } from "@/components/teach-jojo/review-screen";
import { requireUserId } from "@/lib/auth/user";
import { listSessionsForUser } from "@/lib/sessions/repo";
import { loadSession, SessionError, toObjectives } from "@/lib/sessions/service";
import { toRail } from "@/lib/sessions/rail";

type Params = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Review your session" };

export default async function ReviewPage({ params }: Params) {
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
  return (
    <ReviewScreen
      rail={rail}
      session={{
        id: b.session.id,
        subjectId: b.session.subjectId,
        subjectName: b.session.subjectName,
        title: b.session.title,
        status: b.session.status,
        reviewStatus: b.session.reviewStatus,
        completedAt: b.session.completedAt?.toISOString() ?? null,
      }}
      objectives={toObjectives(b.objectives)}
      messages={b.messages.map((m) => ({ id: m.id, turnIndex: m.turnIndex, role: m.role, content: m.content }))}
      tags={b.tags.map((t) => ({ messageId: t.messageId, tag: t.tag, reason: t.reason, quotes: t.quotes ?? [] }))}
      help={b.help.map((h) => ({ role: h.role, content: h.content, afterMainMessageIndex: h.afterMainMessageIndex }))}
      review={
        b.review
          ? {
              strengths: b.review.strengths,
              weaknesses: b.review.weaknesses,
              suggestedPractice: b.review.suggestedPractice ?? [],
              annotations: b.review.annotations.map((a) => ({ turnIndex: a.turnIndex, type: a.type, comment: a.comment })),
              demo: b.review.modelId === "mock" || b.review.modelId === null,
            }
          : null
      }
    />
  );
}
