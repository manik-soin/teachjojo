import { IconAlertCircleFilled, IconAlertTriangleFilled, IconChevronLeft, IconChevronRight, IconCircleCheckFilled, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "@/components/ui/rich-text";
import { RESOURCE_ORIGIN } from "@/lib/syllabus/resources";
import { HelpMessage } from "./help-drawer";
import type { SuggestedPractice } from "@/lib/db/schema";
import type { MessageTag, Objective } from "@/lib/jojo/contract";
import { completedCount } from "@/lib/jojo/objectives";
import { splitBubbles } from "@/lib/jojo/prompt";
import { cn } from "@/lib/utils";
import { Divider, JojoGroup, StudentBubble, TagPill } from "./bubbles";
import { RetryReview } from "./retry-review";
import { LocalTime } from "@/components/ui/local-time";
import { SessionsRail, type RailSession } from "./sessions-rail";
import { TranscriptTabs } from "./transcript-tabs";

type Annotation = { turnIndex: number; type: "positive" | "negative" | "neutral"; comment: string };

export type ReviewScreenProps = {
  session: {
    id: string;
    subjectId: string;
    subjectName: string;
    title: string;
    status: "started" | "pending_completion" | "completed";
    reviewStatus: "generating" | "completed" | "failed" | null;
    completedAt: string | null;
  };
  objectives: Objective[];
  messages: { id: string; turnIndex: number; role: "user" | "assistant"; content: string }[];
  tags: { messageId: string; tag: MessageTag; reason: string; quotes?: string[] }[];
  help: { role: "user" | "assistant"; content: string; afterMainMessageIndex: number | null }[];
  /** `demo` is true when the review was written by the deterministic stand-in (or before provenance was recorded). */
  review: { strengths: string[]; weaknesses: string[]; suggestedPractice: SuggestedPractice[]; annotations: Annotation[]; demo: boolean } | null;
  rail: RailSession[];
};

/** Transcript with margin annotations, review panel on the right (a tab below lg). Rebuilt from the product's live markup. */
export function ReviewScreen({ session, objectives, messages, tags, help, review, rail }: ReviewScreenProps) {
  const tagByMessage = new Map(tags.map((t) => [t.messageId, t]));
  const annotationsByTurn = new Map<number, Annotation[]>();
  for (const a of review?.annotations ?? []) annotationsByTurn.set(a.turnIndex, [...(annotationsByTurn.get(a.turnIndex) ?? []), a]);
  const helpAfter = new Set(help.filter((h) => h.role === "user").map((h) => h.afterMainMessageIndex));
  const warnings = tags.filter((t) => t.tag === "inaccurate" || t.tag === "mistake").length;
  const ended = session.completedAt;

  const transcript = (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-1">
        {messages.map((m) => {
          const tag = tagByMessage.get(m.id);
          const anns = annotationsByTurn.get(m.turnIndex) ?? [];
          return (
            <div key={m.id}>
              {m.role === "assistant" ? (
                <JojoGroup bubbles={splitBubbles(m.content)} />
              ) : (
                <div className="mt-3 flex w-full flex-col items-end gap-1.5">
                  <StudentBubble flagged={tag?.tag === "inaccurate" || tag?.tag === "mistake"} reason={tag?.reason} quotes={tag?.quotes}>
                    {m.content}
                  </StudentBubble>
                  {tag ? <TagPill tag={tag.tag} reason={tag.reason} /> : null}
                  {anns.map((a, i) => (
                    <AnnotationCard key={i} annotation={a} />
                  ))}
                </div>
              )}
              {helpAfter.has(m.turnIndex) ? <Divider>You asked Jojo for help</Divider> : null}
            </div>
          );
        })}
      </div>

      {ended ? (
        <div className="my-6 flex items-center gap-3 font-medium">
          <div className="h-0.5 flex-1 bg-muted" />
          <p className="whitespace-nowrap text-xs text-muted-foreground">
            Session ended · <LocalTime iso={ended} />
          </p>
          <div className="h-0.5 flex-1 bg-muted" />
        </div>
      ) : null}

      <div className="mt-20 mb-8">
        <p className="mb-4 text-xs font-medium text-muted-foreground">
          Learning objectives · {completedCount(objectives)}/{objectives.length} completed
        </p>
        <ul className="space-y-4">
          {objectives.map((o) => (
            <li key={o.id} className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-1 size-3 shrink-0 rounded-full",
                  o.status === "completed" && "bg-emerald-500",
                  o.status === "needs_review" && "bg-orange-500",
                  o.status === "in_progress" && "bg-amber-500",
                  o.status === "not_started" && "border-2 border-border bg-transparent",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">{o.text}</p>
                {o.status === "needs_review" ? <p className="mt-0.5 text-xs font-medium text-orange-500">Needs review</p> : null}
                {o.status === "not_started" ? <p className="mt-0.5 text-xs font-medium text-muted-foreground">Not started</p> : null}
                {o.status === "in_progress" ? <p className="mt-0.5 text-xs font-medium text-amber-500">In progress</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const helpChat = (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-4 sm:px-6">
      {help.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Image src="/jojo/revisiondojo-favicon.svg" alt="" width={48} height={48} className="size-12 rounded-2xl opacity-70" />
          <p className="font-medium">You didn&apos;t ask Jojo for help</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Next time you get stuck, use Ask for help in the composer. That conversation lands here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {help.map((h, i) => (
            <HelpMessage key={i} turn={h} />
          ))}
        </div>
      )}
    </div>
  );

  const panel = <ReviewPanel session={session} review={review} />;

  return (
    <div className="flex h-full min-h-0 w-full">
      <SessionsRail sessions={rail} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="scrollbar-thin flex min-w-0 flex-1 flex-col overflow-y-auto">
            <TranscriptTabs
              helpCount={help.filter((h) => h.role === "user").length}
              transcript={transcript}
              help={helpChat}
              review={<div className="mx-auto w-full max-w-2xl flex-1 px-4 py-4 sm:px-6 lg:hidden">{panel}</div>}
              leading={
                <Link
                  href="/teach-jojo"
                  className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-1.5 rounded-2xl bg-muted px-3 py-1 text-sm font-medium text-muted-foreground transition-all hover:bg-muted-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-foreground/50"
                >
                  <IconChevronLeft className="size-4" /> Go back
                </Link>
              }
              trailing={
                <div className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold tabular-nums" title={`${warnings} flagged ${warnings === 1 ? "turn" : "turns"}`}>
                  <IconAlertTriangleFilled className="size-4 text-amber-500" />
                  <span>{warnings}</span>
                </div>
              }
            />
          </div>

          <aside className="scrollbar-thin hidden w-88 shrink-0 overflow-y-auto border-l-2 border-border bg-background p-5 lg:block xl:w-96">{panel}</aside>
        </div>
      </div>
    </div>
  );
}

function ReviewPanel({ session, review }: Pick<ReviewScreenProps, "session" | "review">) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className="h4 font-title">Review your session</h2>
          {review?.demo ? (
            <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400" title="This review was written by the deterministic demo model, not a live tutor model. Treat it as illustrative.">
              Demo review
            </span>
          ) : null}
        </div>
        <Link
          href="/teach-jojo"
          aria-label="Close review"
          className="-mt-1 -mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-muted-foreground transition-all hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          <IconX className="size-5" />
        </Link>
      </div>

      {review ? (
        <>
          <div>
            <div className="mb-3 flex items-center gap-2">
              <h3 className="font-medium">Strengths</h3>
            </div>
            {review.strengths.length === 0 ? (
              <p className="text-sm text-muted-foreground">No strengths recorded for this session.</p>
            ) : (
              <ul className="space-y-2">
                {review.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <IconCircleCheckFilled className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                    <div className="text-[15px] leading-relaxed text-foreground/90">
                      <RichText text={s} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2">
              <h3 className="font-medium">Areas for Improvement</h3>
            </div>
            {review.weaknesses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No areas for improvement recorded.</p>
            ) : (
              <ul className="space-y-2">
                {review.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <IconAlertCircleFilled className="mt-0.5 size-5 shrink-0 text-orange-500" />
                    <div className="text-[15px] leading-relaxed text-foreground/90">
                      <RichText text={w} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2">
              <h3 className="font-medium">Suggested Practice</h3>
            </div>
            <ul className="space-y-2">
              {review.suggestedPractice.map((p, i) => {
                const body = (
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">{p.title}</p>
                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                      {p.topicLabel} · {p.kind}
                    </p>
                    <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-3 py-1 text-sm font-medium text-background transition-all group-hover:bg-foreground/80">
                      Open <IconChevronRight className="size-4 opacity-60" />
                    </span>
                  </div>
                );
                const card = "group flex items-start gap-3 rounded-xl bg-muted p-4 transition-colors hover:bg-muted-hover";
                return (
                  <li key={i}>
                    {p.url ? (
                      // The product's cards open the matching resource in RevisionDojo's library; ours link to the same paths.
                      <a href={`${RESOURCE_ORIGIN}${p.url}`} target="_blank" rel="noreferrer" className={card} aria-label={`${p.title}, opens RevisionDojo ${p.kind} in a new tab`}>
                        {body}
                      </a>
                    ) : (
                      <Link href={`/teach-jojo?start=1&subject=${encodeURIComponent(session.subjectId)}`} className={card}>
                        {body}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : (
        <div className="rounded-xl bg-muted p-4 text-sm leading-relaxed text-muted-foreground">
          {session.reviewStatus === "failed" ? (
            <>
              Jojo could not write the review for this session. The transcript and objectives are complete.
              <RetryReview sessionId={session.id} />
            </>
          ) : session.status === "started" ? (
            <>
              This session is still going.{" "}
              <Link href={`/teach-jojo/${session.id}`} className="text-accent-primary-foreground underline underline-offset-4">
                Continue teaching
              </Link>{" "}
              and end it to get a review.
            </>
          ) : (
            <>
              Jojo is writing your review.
              <RetryReview sessionId={session.id} label="Check again" />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function AnnotationCard({ annotation }: { annotation: Annotation }) {
  const negative = annotation.type === "negative";
  const positive = annotation.type === "positive";
  return (
    <div className="ml-auto max-w-[75%] rounded-2xl border-2 border-border bg-card p-3">
      <div className="flex gap-2">
        <div className={cn("w-1 shrink-0 self-stretch rounded-full opacity-70", negative ? "bg-red-600 dark:bg-red-400" : positive ? "bg-emerald-600 dark:bg-emerald-400" : "bg-muted-foreground")} />
        <div className="min-w-0 flex-1 pl-1">
          <p className={cn("mb-0.5 text-sm font-semibold", negative ? "text-red-600 dark:text-red-400" : positive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
            {negative ? "Areas for improvement" : positive ? "Strengths" : "Note"}
          </p>
          <div className="text-[15px] leading-relaxed text-foreground/90">
            <RichText text={annotation.comment} />
          </div>
        </div>
      </div>
    </div>
  );
}
