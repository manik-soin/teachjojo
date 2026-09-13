import type { MessageTag, Objective, ObjectiveStatus, ObjectiveUpdate, SessionDepth } from "./contract";

const RANK: Record<ObjectiveStatus, number> = { not_started: 0, in_progress: 1, needs_review: 2, completed: 3 };

/**
 * Apply the model's proposed transitions. Pure, unit-tested.
 *
 * Rules the model is not trusted with:
 *  - unknown ids are dropped;
 *  - a completed objective is never demoted;
 *  - completion needs evidence: the same turn must be tagged great or good, and when the caller
 *    passes `grounded: false` (quote not found in the message, or the model's own say-it-back check
 *    failed) completion is downgraded to in_progress;
 *    a null tag (stall, question back, gibberish) or inaccurate/mistake cannot complete anything;
 *  - needs_review is not a trap: a great/good turn may move it back to in_progress;
 *  - one update per objective per turn (the last one wins);
 *  - when the caller passes `completeAllowed`, an objective it refuses (rubric ideas not all covered,
 *    or the message echoed a tutor hint) is held at in_progress instead of completed.
 */
export function applyObjectiveUpdates(
  objectives: Objective[],
  updates: ObjectiveUpdate[],
  opts: { tag?: MessageTag | null; grounded?: boolean; completeAllowed?: (objectiveId: string) => boolean } = {},
): { objectives: Objective[]; applied: ObjectiveUpdate[] } {
  const byId = new Map(objectives.map((o) => [o.id, o]));
  const applied: ObjectiveUpdate[] = [];
  // Evidence gate: a great/good tag on this turn, and (when the caller checked it) the model's quoted
  // evidence really appears in the student's message and the model itself says it could say the objective back.
  const canComplete = (opts.tag === "great" || opts.tag === "good") && opts.grounded !== false;

  for (const u of updates) {
    const current = byId.get(u.objectiveId);
    if (!current) continue;
    let next = u.status;
    if (current.status === "completed") continue;
    if (next === "completed" && (!canComplete || (opts.completeAllowed && !opts.completeAllowed(u.objectiveId)))) next = "in_progress";
    if (next === current.status) continue;
    const recovering = current.status === "needs_review" && next === "in_progress" && canComplete;
    if (RANK[next] < RANK[current.status] && next !== "needs_review" && !recovering) continue;
    byId.set(u.objectiveId, { ...current, status: next });
    applied.push({ objectiveId: u.objectiveId, status: next });
  }

  // Collapse repeated ids so the commit issues one UPDATE per objective.
  const lastById = new Map(applied.map((u) => [u.objectiveId, u]));
  return { objectives: objectives.map((o) => byId.get(o.id) ?? o), applied: [...lastById.values()] };
}

/**
 * Rubric gate: an objective with required ideas is complete only when the grader has
 * listed every one of them as covered. Matching is lenient on punctuation and case
 * and accepts a covered entry that contains the required idea or vice versa, since
 * models sometimes trim a clause. Objectives without a rubric always pass.
 */
export function coversAllCriteria(objective: Pick<Objective, "criteria">, covered: string[]): boolean {
  const required = objective.criteria ?? [];
  if (required.length === 0) return true;
  const n = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const got = covered.map(n).filter(Boolean);
  // A covered entry must carry the whole required idea; a trimmed clause ("...and hydrophobic tails") does not cover "tails point inwards".
  const negated = /\b(not|never|no|didn t|did not|without|missing|failed|fails|lacks?|unclear|only partly|partially)\b/;
  return required.every((r) => {
    const rn = n(r);
    // Equal, or containing the whole idea without a negation wrapped around it ("the student did NOT demonstrate ...").
    return got.some((g) => g === rn || (g.includes(rn) && !negated.test(g.replace(rn, " "))));
  });
}

const LEX_STOP = new Set(["their", "there", "these", "those", "which", "where", "while", "about", "other", "another", "because", "through", "between", "before", "after", "would", "could", "should", "thing", "things", "means", "using", "given", "makes", "stays", "still", "every", "since", "under", "along", "across", "towards", "within", "without", "example", "such"]);

/**
 * Deterministic backstop against a grader that lists ideas the student never said:
 * a covered idea counts only if at least one of its distinctive words appears in the
 * student's own words. Long words match on their first seven letters, so
 * "electronegative" covers "electronegativity" but "phosphate" does not ride on
 * "phospholipid"; shorter words must appear whole. Ideas made only of short words
 * pass on the grader's judgement alone.
 */
export function lexicallySupported(idea: string, studentText: string): boolean {
  const words = idea.toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 5 && !LEX_STOP.has(w));
  if (words.length === 0) return true;
  const text = studentText.toLowerCase();
  return words.some((w) => (w.length >= 8 ? text.includes(w.slice(0, 7)) : new RegExp(`\\b${w}\\b`).test(text)));
}

/** Models often wrap the verbatim evidence in quotation marks; the stored quote (and the underline) must not include them. */
export function stripWrappingQuotes(s: string): string {
  return s.trim().replace(/^[\s"'“”‘’«»`]+|[\s"'“”‘’«»`]+$/g, "");
}

/**
 * A stall: the student declined or could not answer. Decided in code because the
 * grader keeps tagging "i don't know" as good or mistake; a stall earns no tag,
 * and it moves the stall ladder rather than the objective.
 */
export function isStall(message: string): boolean {
  const m = message.toLowerCase().replace(/[^a-z' ]+/g, " ").replace(/\s+/g, " ").trim();
  if (!m) return !/\p{L}/u.test(message); // punctuation or symbols only; an answer in another script is not a stall
  if (m.split(" ").length > 7) return false; // long enough to be an attempt, even if it opens with "i forgot"
  const core = m
    .replace(/\b(um+|uh+|hmm+|erm+|sorry|tbh|honestly|really|lol|idk|at all|about (that|this|it)|this one|that one|to be honest|i think|i guess|maybe)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!core) return true; // nothing but filler ("idk", "hmm sorry")
  // The whole message must be the stall; "i don't know the second part" or "help me with osmosis" are attempts the grader handles.
  return /^((i )?(don'?t|dont|do not) (know|remember|get it)|(i )?(have )?no (idea|clue)|not sure|unsure|dunno|i forgot|i forget|i can'?t remember|i give up|pass|skip|next|no|nope|nah|yes|yeah|yep|ok|okay|k|sure|right|correct|exactly|help|help me|i need help|what)$/.test(core);
}

export function allCompleted(objectives: Objective[]): boolean {
  return objectives.length > 0 && objectives.every((o) => o.status === "completed");
}

export function completedCount(objectives: Objective[]): number {
  return objectives.filter((o) => o.status === "completed").length;
}

/** The objective Jojo is currently on: first in_progress, else first not_started, else first needs_review. */
export function currentObjective(objectives: Objective[]): Objective | undefined {
  return (
    objectives.find((o) => o.status === "in_progress") ??
    objectives.find((o) => o.status === "not_started") ??
    objectives.find((o) => o.status === "needs_review")
  );
}

/** Quick: four turns per objective capped at 16 (their default). In-depth: six, capped at 24. */
export function maxTurnsFor(objectiveCount: number, depth: SessionDepth): number {
  const n = Math.max(objectiveCount, 1);
  return depth === "in_depth" ? Math.min(6 * n, 24) : Math.min(4 * n, 16);
}

export const STATUS_LABEL: Record<ObjectiveStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
  needs_review: "Needs review",
};

/**
 * Deterministic grounding check for the model's assessment: the quoted evidence
 * must actually occur in the student's message (whitespace- and case-insensitive)
 * and the model must have passed its own say-it-back test. Pure, unit-tested.
 */
export function isGrounded(studentMessage: string, assessment: { evidence: string; canSayItBack: boolean }): boolean {
  if (!assessment.canSayItBack) return false;
  const norm = (s: string) => s.toLowerCase().replace(/[\s"'`“”‘’«».,;:!?()]+/g, " ").trim();
  const quote = norm(assessment.evidence);
  if (quote.length < 8) return false;
  const message = norm(studentMessage);
  // Models that try to quote a whole paragraph sometimes garble the tail at the length cap; a long verbatim head still grounds the tag.
  return message.includes(quote) || (quote.length > 80 && message.includes(quote.slice(0, 80)));
}
