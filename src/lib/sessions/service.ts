import type { ObjectiveRow, SessionRow, SuggestedPractice } from "@/lib/db/schema";
import type { ChatMessage, Difficulty, HelpResponse, JojoTurnOutput, JojoTurnResponse, MessageTag, Objective, SessionDepth } from "@/lib/jojo/contract";
import { runHelpTurn, runJojoTurn, runJojoTurnStreaming, runObjectiveGeneration, runOpening, runReview } from "@/lib/jojo/leaves";
import { resolveModel } from "@/lib/jojo/model";
import { allCompleted, applyObjectiveUpdates, coversAllCriteria, isGrounded, isStall, lexicallySupported, maxTurnsFor, stripWrappingQuotes } from "@/lib/jojo/objectives";
import { planTurn, type PlanMessage } from "@/lib/jojo/turn-plan";
import { openingMessage, PROMPT_VERSION, splitBubbles, type PromptContext } from "@/lib/jojo/prompt";
import { findSubject, findTopic, MAX_TOPICS } from "@/lib/syllabus/data";
import { resourceUrl } from "@/lib/syllabus/resources";
import {
  assistantReplyExists,
  claimHelpTurn,
  claimReview,
  claimUserTurn,
  commitTurn,
  completeHelpTurn,
  findExchangeByRequest,
  countSessionsToday,
  createSession,
  failReview,
  getSessionForUser,
  listObjectives,
  loadBundle,
  publishReview,
  recordModelCall,
  releaseHelpTurn,
  releaseStaleClaims,
  releaseUserTurn,
  type SessionBundle,
} from "./repo";

/** Use cases. Deterministic orchestration around the model leaves. */

export class SessionError extends Error {
  constructor(
    public readonly code: "not_found" | "invalid" | "finished" | "conflict" | "limit",
    message: string,
  ) {
    super(message);
  }
}

/** Spend guards for an anonymous product. Generous for a real student, useless for a script. */
export const LIMITS = { sessionsPerDay: 20, helpPerSession: 12, objectivesPerSession: 12 } as const;

export type StartSessionInput = {
  userId: string;
  subjectId: string;
  topicIds: string[];
  focusText?: string;
  difficulty: Difficulty;
  sessionDepth: SessionDepth;
};

export async function startSession(input: StartSessionInput): Promise<SessionRow> {
  const subject = findSubject(input.subjectId);
  if (!subject) throw new SessionError("invalid", "Unknown subject.");
  if ((await countSessionsToday(input.userId)) >= LIMITS.sessionsPerDay) {
    throw new SessionError("limit", "You have started a lot of sessions today. Come back tomorrow, or review one you have.");
  }

  const picked = input.topicIds.slice(0, MAX_TOPICS).map((tid) => {
    const found = findTopic(subject, tid);
    if (!found) throw new SessionError("invalid", `Unknown topic ${tid}.`);
    return found;
  });
  const focus = input.focusText?.trim() ?? "";
  if (picked.length === 0 && focus.length < 12) throw new SessionError("invalid", "Pick at least one topic or describe what you want to review.");

  const objectives: { text: string; topicId: string | null; topicLabel: string | null }[] = picked.flatMap(({ topic }) =>
    topic.objectives.map((text) => ({ text, topicId: topic.id, topicLabel: `${topic.code} ${topic.label}` })),
  );
  let title = picked.map(({ topic }) => topic.label).join(", ");

  if (focus.length >= 12) {
    const { output, envelope } = await runObjectiveGeneration(resolveModel(), subject.name, focus);
    await recordModelCall("objectives", envelope);
    // Generated text is rendered inside the system prompt later, so it is flattened to one plain line first.
    const generatedTitle = plainLine(output.title) || "Custom material";
    const generated = output.objectives.map(plainLine).filter((t) => t.length >= 8);
    if (generated.length === 0) throw new SessionError("invalid", "Jojo could not turn that description into objectives. Try describing the topic in a sentence or two.");
    // Custom objectives are what the student asked for: they go first so the cap never drops them.
    objectives.unshift(...generated.map((text) => ({ text, topicId: null, topicLabel: generatedTitle })));
    title = title ? `${generatedTitle} + ${title}` : generatedTitle;
  }

  const bounded = objectives.slice(0, LIMITS.objectivesPerSession);
  if (bounded.length === 0) throw new SessionError("invalid", "Nothing to review yet for that selection. Pick another topic or describe the material.");
  const openingObjectives: Objective[] = bounded.map((o, i) => ({ id: String(i), text: o.text, status: "not_started" }));
  // Jojo's first message comes from the model, in its own words; the template only steps in if that call fails.
  let opening: string;
  try {
    const { output, envelope } = await runOpening(resolveModel(), {
      subjectName: subject.name,
      topics: picked.map(({ topic }) => ({ label: `${topic.code} ${topic.label}` })),
      objectives: openingObjectives,
      difficulty: input.difficulty,
    });
    await recordModelCall("opening", envelope);
    opening = output.response;
  } catch (error) {
    console.error("[teach-jojo] opening call failed, using the template", error);
    opening = openingMessage(openingObjectives, input.difficulty);
  }

  return createSession({
    userId: input.userId,
    subjectId: subject.id,
    subjectName: subject.name,
    title,
    topics: picked.map(({ unit, topic }) => ({ id: topic.id, code: topic.code, label: topic.label, unit: unit.label })),
    topicMode: picked.length > 0 ? "topic" : "custom",
    focusText: focus || null,
    difficulty: input.difficulty,
    sessionDepth: input.sessionDepth,
    objectives: bounded,
    maxTurns: maxTurnsFor(bounded.length, input.sessionDepth),
    opening,
  });
}

export async function loadSession(sessionId: string, userId: string): Promise<SessionBundle> {
  const session = await getSessionForUser(sessionId, userId);
  if (!session) throw new SessionError("not_found", "Session not found.");
  return loadBundle(session);
}

export function toObjectives(rows: ObjectiveRow[]): Objective[] {
  return rows.map((o) => ({ id: o.id, text: o.text, status: o.status, topicLabel: o.topicLabel }));
}

/** One line of plain text: no newlines, no markdown headings or list markers, no tag-like brackets. */
function plainLine(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/^[\s#>*\-\d.)]+/, "")
    .replace(/[<>[\]`]/g, "")
    .trim()
    .slice(0, 200);
}

/** The client never needs the rubric text; keep responses to the public objective shape. */
function stripCriteria(o: Objective): Objective {
  const { criteria, ...rest } = o;
  void criteria;
  return rest;
}

/** Objectives with their syllabus rubric attached (required ideas), for the grader. Custom objectives have none. */
function objectivesWithCriteria(b: SessionBundle): Objective[] {
  const subject = findSubject(b.session.subjectId);
  return b.objectives.map((o) => {
    const topic = subject && o.topicId ? findTopic(subject, o.topicId)?.topic : undefined;
    const criteria = topic?.criteria?.[o.text];
    return { id: o.id, text: o.text, status: o.status, topicLabel: o.topicLabel, ...(criteria ? { criteria } : {}) };
  });
}

function promptContext(b: SessionBundle, objectives: Objective[]): PromptContext {
  return {
    subjectName: b.session.subjectName,
    topics: b.session.topics.map((t) => ({ label: `${t.code} ${t.label}`, unit: t.unit })),
    focusText: b.session.focusText,
    objectives,
    difficulty: b.session.difficulty,
    sessionDepth: b.session.sessionDepth,
    turnsUsed: b.session.turnsUsed,
    maxTurns: b.session.maxTurns,
    misconceptions: misconceptionsFor(b.session.subjectId, b.session.topics.map((t) => t.id)),
  };
}

function misconceptionsFor(subjectId: string, topicIds: string[]): string[] {
  const subject = findSubject(subjectId);
  if (!subject) return [];
  return topicIds.flatMap((id) => findTopic(subject, id)?.topic.misconceptions ?? []);
}

export type PartialListener = (bubbles: string[]) => void;

export async function takeTurn(
  args: { sessionId: string; userId: string; message: string; requestId?: string },
  onPartial?: PartialListener,
): Promise<JojoTurnResponse> {
  const b = await loadSession(args.sessionId, args.userId);

  // A retry of a send that already committed (the response was lost in transit) replays the stored exchange.
  if (args.requestId) {
    const existing = await findExchangeByRequest(b.session.id, args.requestId);
    if (existing) {
      if (existing.user.content !== args.message) throw new SessionError("conflict", "That retry does not match the original message. Send it as a new message.");
      return {
        turnIndex: existing.assistant.turnIndex,
        bubbles: splitBubbles(existing.assistant.content),
        confidence: b.session.confidence,
        objectives: toObjectives(b.objectives),
        tag: existing.tag ? { value: existing.tag.tag, reason: existing.tag.reason, quotes: existing.tag.quotes ?? [] } : null,
        turnsUsed: b.session.turnsUsed,
        maxTurns: b.session.maxTurns,
        status: b.session.status,
      };
    }
  }

  if (b.session.status !== "started") throw new SessionError("finished", "This session has ended.");

  // A worker that died after claiming leaves a reply-less student message; clear it so the session is not stuck.
  if ((await releaseStaleClaims(b.session.id)) > 0) return takeTurn(args, onPartial);

  const last = b.messages.at(-1);
  if (last?.role === "user") throw new SessionError("conflict", "Jojo is already answering. Give it a second and refresh.");
  const userTurnIndex = (last?.turnIndex ?? -1) + 1;
  const claim = await claimUserTurn(b.session.id, userTurnIndex, args.message, args.requestId);
  if (claim === "conflict") throw new SessionError("conflict", "Jojo is already answering. Give it a second and refresh.");
  if (claim === "finished") throw new SessionError("finished", "This session has ended.");

  const objectives = objectivesWithCriteria(b);
  const history: ChatMessage[] = [...b.messages.map((m) => ({ role: m.role, content: m.content })), { role: "user", content: args.message }];
  // Code decides the shape of this turn (move rotation, stall ladder position, openers to avoid, pasted-hint check); the model grades and executes.
  const tagByMessage = new Map(b.tags.map((t) => [t.messageId, t.tag]));
  const planMessages: PlanMessage[] = b.messages.map((m) => ({ role: m.role, content: m.content, turnIndex: m.turnIndex, createdAt: m.createdAt, tag: m.role === "user" ? (tagByMessage.get(m.id) ?? null) : undefined }));
  // The stall ladder restarts when an objective was closed (completed or given up on); an in_progress bump does not reset it.
  const closedAt = b.objectives.filter((o) => o.status === "completed" || o.status === "needs_review").map((o) => o.updatedAt.getTime());
  const plan = planTurn({
    messages: planMessages,
    turnsUsed: b.session.turnsUsed,
    difficulty: b.session.difficulty,
    message: args.message,
    helpReplies: b.help.filter((h) => h.role === "assistant").map((h) => h.content),
    since: closedAt.length ? new Date(Math.max(...closedAt)) : undefined,
  });
  // The student's own words: every student turn that was not a pasted hint, plus this message unless it is one.
  const ownWords = [...planMessages.filter((m) => m.role === "user" && !plan.echoedTurns.includes(m.turnIndex ?? -1)).map((m) => m.content), ...(plan.echoedHint ? [] : [args.message])].join("\n");

  let output: JojoTurnOutput | undefined;
  let envelope;
  let tag: { value: MessageTag; reason: string; quotes: string[] } | null = null;
  try {
    const ref = resolveModel();
    const ctx = { ...promptContext(b, objectives), plan };
    ({ output, envelope } = onPartial
      ? await runJojoTurnStreaming(ref, ctx, history, (text) => onPartial(splitBubbles(text)))
      : await runJojoTurn(ref, ctx, history));

    // A stall ("i don't know", "not sure") is decided in code: it earns no tag whatever the grader said,
    // and it cannot push an objective to needs_review before the ladder has reached the nudge.
    const stalled = isStall(args.message);
    const assessment = stalled ? { ...output.assessment, evidence: "", tag: { value: null, reason: "" } } : output.assessment;
    const proposedUpdates = stalled && plan.stallCount < 2 ? output.objectiveUpdates.filter((u) => u.status !== "needs_review") : output.objectiveUpdates;
    // The verbatim evidence becomes the tag's quote only when it really occurs in the message; the UI underlines exactly that span.
    const quote = stripWrappingQuotes(assessment.evidence);
    const quotes = quote && args.message.toLowerCase().includes(quote.toLowerCase()) ? [quote] : [];
    tag = assessment.tag.value ? { value: assessment.tag.value, reason: assessment.tag.reason, quotes } : null;
    // Completion needs a great/good tag, the grader's own say-it-back check, a message in the student's own words (not a
    // pasted hint), and either every rubric idea covered (each one lexically supported by what the student actually wrote)
    // or, for custom objectives with no rubric, a quote that is really in the message.
    const covered = assessment.covered.filter((c) => lexicallySupported(c, ownWords));
    const { objectives: next, applied } = applyObjectiveUpdates(objectives, proposedUpdates, {
      tag: tag?.value,
      grounded: !plan.echoedHint && assessment.canSayItBack,
      completeAllowed: (id) => {
        const objective = objectives.find((o) => o.id === id);
        return objective?.criteria?.length ? coversAllCriteria(objective, covered) : isGrounded(args.message, assessment);
      },
    });
    const committed = await commitTurn({
      sessionId: b.session.id,
      userMessageId: claim.userMessageId,
      assistantText: output.response,
      assistantTurnIndex: userTurnIndex + 1,
      tag,
      objectiveUpdates: applied,
      confidence: output.confidence,
      allCompleted: allCompleted(next),
      envelope,
    });
    // The claim and the review claim exclude each other, so this only trips in the read-committed window between the two.
    if (!committed) throw new SessionError("finished", "This session ended while Jojo was replying.");
    return {
      turnIndex: userTurnIndex + 1,
      bubbles: splitBubbles(output.response),
      confidence: output.confidence,
      objectives: next.map(stripCriteria),
      tag,
      turnsUsed: committed.turnsUsed,
      maxTurns: b.session.maxTurns,
      status: committed.status,
    };
  } catch (error) {
    if (error instanceof SessionError && error.code === "finished") throw error;
    // The commit may have landed and only its response been lost: then the student's message must stay under its reply.
    if (output && (await assistantReplyExists(b.session.id, userTurnIndex + 1).catch(() => false))) {
      const [session, rows] = await Promise.all([getSessionForUser(b.session.id, args.userId), listObjectives(b.session.id)]);
      return {
        turnIndex: userTurnIndex + 1,
        bubbles: splitBubbles(output.response),
        confidence: output.confidence,
        objectives: toObjectives(rows),
        tag,
        turnsUsed: session?.turnsUsed ?? b.session.turnsUsed + 1,
        maxTurns: b.session.maxTurns,
        status: session?.status ?? "started",
      };
    }
    // Model failure or a DB error before the commit: never leave a reply-less claim that would wedge the session.
    await releaseUserTurn(claim.userMessageId).catch(() => undefined);
    throw error;
  }
}

export async function askForHelp(args: { sessionId: string; userId: string; message: string }): Promise<HelpResponse> {
  const b = await loadSession(args.sessionId, args.userId);
  if (b.session.status === "completed") throw new SessionError("finished", "This session has ended.");
  const afterMain = b.messages.at(-1)?.turnIndex ?? 0;
  // The quota is reserved by the insert itself, before any paid call.
  const claim = await claimHelpTurn(b.session.id, args.message, afterMain, LIMITS.helpPerSession);
  if (claim === "limit") throw new SessionError("limit", "That's plenty of hints for one session. Try teaching it back to Baby Jojo.");
  const objectives = toObjectives(b.objectives);
  const main: ChatMessage[] = b.messages.map((m) => ({ role: m.role, content: m.content }));
  const helpHistory: ChatMessage[] = [...b.help.map((m) => ({ role: m.role, content: m.content })), { role: "user", content: args.message }];
  try {
    const { output, envelope } = await runHelpTurn(resolveModel(), promptContext(b, objectives), main, helpHistory);
    await completeHelpTurn(b.session.id, claim.orderIndex + 1, output.response, afterMain, envelope);
    return { orderIndex: claim.orderIndex + 1, content: output.response };
  } catch (error) {
    await releaseHelpTurn(claim.id).catch(() => undefined);
    throw error;
  }
}

const REVIEW_CLAIM_TTL_MS = 120_000;

export type EndResult = { outcome: "completed" | "already_done" | "in_progress" | "failed"; objectives: Objective[] };

/**
 * End the session and generate the review. Concurrency-safe: the review claim
 * is an atomic conditional update, so exactly one caller runs the model; the
 * others see `in_progress` or `already_done`.
 */
export async function endSession(args: { sessionId: string; userId: string }): Promise<EndResult> {
  let b = await loadSession(args.sessionId, args.userId);
  const objectives = toObjectives(b.objectives);
  if (b.session.reviewStatus === "completed" && b.review) return { outcome: "already_done", objectives };
  // A live review worker is at most a couple of minutes old; anything older crashed and the claim below may take over.
  if (b.session.reviewStatus === "generating" && Date.now() - b.session.updatedAt.getTime() < REVIEW_CLAIM_TTL_MS) return { outcome: "in_progress", objectives };
  // A turn worker that died must not block End Session until the student types again.
  await releaseStaleClaims(b.session.id);

  const claimed = await claimReview(b.session.id);
  if (!claimed) return { outcome: "in_progress", objectives };
  // A turn may have committed between our read and the claim; the review must see the transcript the claim froze.
  b = await loadSession(args.sessionId, args.userId);

  // Nothing was taught: publish an honest empty review without spending a model call.
  if (!b.messages.some((m) => m.role === "user")) {
    await publishReview(
      b.session.id,
      {
        strengths: [],
        weaknesses: ["You ended the session before explaining anything. Start with the **first objective** in your own words next time."],
        suggestedPractice: suggestPractice(b),
        annotations: [],
      },
      { modelId: "none", promptVersion: PROMPT_VERSION, latencyMs: 0, validation: "ok" },
    );
    return { outcome: "completed", objectives: toObjectives(await listObjectives(b.session.id)) };
  }

  try {
    const { output, envelope } = await runReview(
      resolveModel(),
      promptContext(b, objectives),
      b.messages.map((m) => ({ turnIndex: m.turnIndex, role: m.role, content: m.content })),
    );
    const userTurns = new Set(b.messages.filter((m) => m.role === "user").map((m) => m.turnIndex));
    await publishReview(
      b.session.id,
      {
        strengths: unique(output.strengths),
        weaknesses: unique(output.weaknesses),
        suggestedPractice: suggestPractice(b),
        annotations: output.annotations.filter((a) => userTurns.has(a.turnIndex)),
      },
      envelope,
    );
    return { outcome: "completed", objectives: toObjectives(await listObjectives(b.session.id)) };
  } catch (error) {
    console.error("[teach-jojo] review failed", error);
    await failReview(b.session.id);
    return { outcome: "failed", objectives };
  }
}

function unique(items: string[]): string[] {
  const seen = new Set<string>();
  return items.filter((s) => {
    const key = s.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Deterministic: one practice card per weak objective's topic, in a fixed rotation of resource kinds.
 * Each card deep-links into RevisionDojo's resource library for that topic, as the product's cards do
 * (`/ib/<subject>/<subject>-<topic>/{flashcards|notes|questionbank}`, videos at the topic root).
 */
function suggestPractice(b: SessionBundle): SuggestedPractice[] {
  const kinds: SuggestedPractice["kind"][] = ["Flashcards", "Notes", "Videos", "Question Bank"];
  const weak = b.objectives.filter((o) => o.status !== "completed");
  const pool = weak.length > 0 ? weak : b.objectives;
  const subject = findSubject(b.session.subjectId);
  return pool.slice(0, 4).map((o, i) => {
    const kind = kinds[i % kinds.length];
    const found = subject && o.topicId ? findTopic(subject, o.topicId) : undefined;
    return {
      title: practiceTitle(o.text, kind),
      topicLabel: o.topicLabel ?? b.session.title,
      kind,
      topicId: o.topicId,
      url: subject && found ? resourceUrl(subject, found.topic, kind) : null,
    };
  });
}

function practiceTitle(objective: string, kind: SuggestedPractice["kind"]) {
  const stem = objective.replace(/^(Describe|Explain|Outline|Compare|Distinguish|Evaluate)\s+(how|why|the|what|between)?\s*/i, "");
  const short = stem.charAt(0).toUpperCase() + stem.slice(1).replace(/\.$/, "");
  switch (kind) {
    case "Flashcards":
      return `${short}: identification drill`;
    case "Notes":
      return `Notes: ${short}`;
    case "Videos":
      return `Introduction to ${short}`;
    default:
      return `Practice problems on ${short}`;
  }
}
