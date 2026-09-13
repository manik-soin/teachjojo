import type { Difficulty, MessageTag } from "./contract";

/**
 * Deterministic per-turn plan for Baby Jojo, computed from session state and
 * handed to the prompt. It exists so that the shape of Jojo's questioning is
 * decided by code that can be tested, not left to the model's habits:
 * the model grades, then executes the move that fits its grade.
 */

export type TeachingMove = "mechanism" | "example" | "flip_condition" | "contrast" | "half_right";

export type TurnPlan = {
  /** The move to use when the student was accurate but incomplete (tag good). Rotates so consecutive turns differ. */
  move: TeachingMove;
  /** Consecutive student turns on the current point that earned no tag (stalls, questions back, gibberish). */
  stallCount: number;
  /** Opening words of Jojo's recent replies, which the next reply must not reuse. */
  avoidOpeners: string[];
  /** The student's message repeats a tutor hint almost verbatim. */
  echoedHint: boolean;
  /** Earlier student turns (by turnIndex) that were pasted hints; they are not evidence of understanding. */
  echoedTurns: number[];
};

export const MOVE_TEXT: Record<TeachingMove, string> = {
  mechanism: "ask for the mechanism: not what happens, but why or how it happens, step by step",
  example: "ask for one concrete everyday example, or offer one guess of your own and ask if it fits",
  flip_condition: "flip one condition (what if it were reversed, larger, colder, absent?) and ask what would change",
  contrast: "ask what makes this different from the nearest similar idea, or for the edge case where the rule breaks",
  half_right: "restate what they said with one deliberate error in it and let them catch and fix it",
};

const ROTATION: TeachingMove[] = ["mechanism", "example", "contrast", "flip_condition"];

/** Transcript view the plan needs: messages in order with the tag each student turn earned. */
export type PlanMessage = { role: "user" | "assistant"; content: string; tag?: MessageTag | null; turnIndex?: number; createdAt?: Date };

export function planTurn(args: { messages: PlanMessage[]; turnsUsed: number; difficulty: Difficulty; message: string; helpReplies: string[]; since?: Date }): TurnPlan {
  const rotation = args.difficulty === "clueless" ? ROTATION : [...ROTATION, "half_right" as const];
  return {
    move: rotation[args.turnsUsed % rotation.length],
    stallCount: countTrailingStalls(args.messages, args.since),
    avoidOpeners: recentOpeners(args.messages, 2),
    echoedHint: echoesHelp(args.message, args.helpReplies),
    echoedTurns: args.messages.filter((m) => m.role === "user" && m.turnIndex !== undefined && echoesHelp(m.content, args.helpReplies)).map((m) => m.turnIndex as number),
  };
}

/**
 * Student turns since the last one that earned a tag; a tagged turn resets the ladder,
 * and so does `since` (the moment the previous objective was closed), so a stall on
 * objective A cannot make Jojo give up on objective B at its first "idk".
 */
export function countTrailingStalls(messages: PlanMessage[], since?: Date): number {
  let n = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "user") continue;
    if (since && m.createdAt && m.createdAt.getTime() <= since.getTime()) break;
    if (m.tag) break;
    n++;
  }
  return n;
}

/** The first few words of Jojo's last replies, lowercased, so the prompt can forbid the same opener twice. */
export function recentOpeners(messages: PlanMessage[], count: number): string[] {
  const out: string[] = [];
  for (let i = messages.length - 1; i >= 0 && out.length < count; i--) {
    const m = messages[i];
    if (m.role !== "assistant") continue;
    const first = m.content.split(/\n\s*---\s*\n/)[0] ?? "";
    const opener = first.toLowerCase().replace(/[^a-z' ]/g, " ").trim().split(/\s+/).slice(0, 3).join(" ");
    if (opener && !out.includes(opener)) out.push(opener);
  }
  return out;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);

/**
 * True when a tutor hint has been lifted into the student's message. Three signals,
 * any one suffices: most of the student's word 4-grams come from a hint (a straight
 * paste), most of some hint's 4-grams appear in the message (a paste padded with
 * unrelated chatter), or ten or more 4-grams match outright (a long paste inside a
 * long message). Short messages (under 8 words) are never counted as echoes.
 */
export function echoesHelp(message: string, helpReplies: string[]): boolean {
  const words = norm(message);
  if (words.length < 8 || helpReplies.length === 0) return false;
  const grams = new Set<string>();
  for (let i = 0; i + 4 <= words.length; i++) grams.add(words.slice(i, i + 4).join(" "));
  let best = 0;
  let studentHits = 0;
  const seen = new Set<string>();
  for (const h of helpReplies) {
    const hw = norm(h);
    const hintGrams = new Set<string>();
    for (let i = 0; i + 4 <= hw.length; i++) hintGrams.add(hw.slice(i, i + 4).join(" "));
    if (hintGrams.size === 0) continue;
    let hits = 0;
    for (const g of grams) {
      if (hintGrams.has(g)) {
        hits++;
        if (!seen.has(g)) {
          seen.add(g);
          studentHits++;
        }
      }
    }
    best = Math.max(best, hits / hintGrams.size);
  }
  return studentHits / grams.size >= 0.6 || best >= 0.5 || studentHits >= 10;
}
