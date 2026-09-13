import { z } from "zod";

/**
 * The typed boundary around the model. Everything the model returns is parsed
 * against one of these schemas before the rest of the system sees it.
 * Enum values match RevisionDojo's own Teach Jojo schema.
 */

export const objectiveStatus = z.enum(["not_started", "in_progress", "completed", "needs_review"]);
export type ObjectiveStatus = z.infer<typeof objectiveStatus>;

export const confidence = z.enum(["low", "medium", "high"]);
export type Confidence = z.infer<typeof confidence>;

export const difficulty = z.enum(["clueless", "knows_a_bit", "pretty_familiar"]);
export type Difficulty = z.infer<typeof difficulty>;

export const sessionDepth = z.enum(["quick", "in_depth"]);
export type SessionDepth = z.infer<typeof sessionDepth>;

export const messageTag = z.enum(["great", "good", "inaccurate", "mistake"]);
export type MessageTag = z.infer<typeof messageTag>;

export const objective = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(300),
  status: objectiveStatus,
  topicLabel: z.string().nullable().optional(),
  /** Required ideas from the syllabus rubric; completion needs every one covered. Absent for custom material. */
  criteria: z.array(z.string()).optional(),
});
export type Objective = z.infer<typeof objective>;

export const chatMessage = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});
export type ChatMessage = z.infer<typeof chatMessage>;

/* ---------- main turn ---------- */

export const jojoTurnInput = z.object({
  sessionId: z.string().min(1),
  message: z.string().trim().min(1).max(4000),
  /** Idempotency key minted by the client per send. */
  requestId: z.string().min(8).max(64).optional(),
});
export type JojoTurnInput = z.infer<typeof jojoTurnInput>;

export const objectiveUpdate = z.object({ objectiveId: z.string(), status: objectiveStatus });
export type ObjectiveUpdate = z.infer<typeof objectiveUpdate>;

/**
 * Field order is deliberate and is the prompting technique: the model grades
 * first (evidence, self-check, tag), then decides objective changes, then
 * speaks in character. Baby Jojo's reply is conditioned on a grade that has
 * already been written down, instead of the grade being rationalised after a
 * reply. `evidence` must be a verbatim quote so the grade is grounded in the
 * student's words and can be checked deterministically.
 */
export const jojoAssessment = z.object({
  evidence: z
    .string()
    .max(240)
    .describe("A short VERBATIM quote from the student's LAST message that the tag rests on. Copy it exactly. Empty string when nothing in the message is worth quoting (stall, question back, chit-chat)."),
  covered: z
    .array(z.string())
    .max(8)
    .describe("For the objective being worked on: the required ideas the student has now demonstrated across the whole conversation, each copied EXACTLY from its 'required ideas' list. Empty when the objective lists no ideas or none has been shown yet."),
  canSayItBack: z.boolean().describe("The test for understanding: could you, Baby Jojo, now say the current objective back in full, unaided, using only what the student has said in this conversation? When the objective lists required ideas this is true only if every one of them is in `covered`. Answer honestly before writing anything else."),
  tag: z.object({
    value: messageTag.nullable().describe(
      "Tag for the student's LAST message: great = complete and accurate explanation; good = accurate and moving things forward; inaccurate = contains a factual error; mistake = a clear misconception or contradiction; null = nothing worth tagging (chit-chat, a question back, a stall).",
    ),
    reason: z.string().max(200).describe("One plain adult sentence justifying the tag, naming the specific claim. Empty when value is null."),
  }),
});
export type JojoAssessment = z.infer<typeof jojoAssessment>;

export const jojoTurnOutput = z.object({
  assessment: jojoAssessment.describe("Expert grading of the student's last message. Written FIRST, out of character, never shown in Jojo's voice."),
  objectiveUpdates: z.array(objectiveUpdate).max(12).describe("Only objectives whose status changed this turn, by exact id. completed requires canSayItBack = true and a great or good tag."),
  confidence: confidence.describe("How well Jojo could now explain the whole set of objectives back, unaided."),
  response: z.string().trim().min(1).max(2000).describe("Baby Jojo's in-character reply, written LAST. Use --- on its own line to split into 1-4 chat bubbles."),
});
export type JojoTurnOutput = z.infer<typeof jojoTurnOutput>;

export const jojoTurnResponse = z.object({
  turnIndex: z.number().int(),
  bubbles: z.array(z.string()).min(1),
  confidence,
  objectives: z.array(objective),
  tag: z.object({ value: messageTag, reason: z.string(), quotes: z.array(z.string()).optional() }).nullable(),
  turnsUsed: z.number().int(),
  maxTurns: z.number().int(),
  status: z.enum(["started", "pending_completion", "completed"]),
});
export type JojoTurnResponse = z.infer<typeof jojoTurnResponse>;

/* ---------- help chat ---------- */

export const helpInput = z.object({ sessionId: z.string().min(1), message: z.string().trim().min(1).max(2000) });
export const helpOutput = z.object({
  response: z.string().trim().min(1).max(1200).describe("Grown-up Jojo's help reply: the smallest nudge that unsticks the student, in 1-3 short sentences. Never the whole answer."),
});
export const helpResponse = z.object({ orderIndex: z.number().int(), content: z.string() });
export type HelpResponse = z.infer<typeof helpResponse>;

/* ---------- session opening ---------- */

export const openingOutput = z.object({
  response: z.string().trim().min(1).max(400).describe("Baby Jojo's first message: asks for help with the first objective in its own everyday words, 1-3 bubbles split by --- on its own line."),
});
export type OpeningOutput = z.infer<typeof openingOutput>;

/* ---------- objectives from custom material ---------- */

export const generatedObjectives = z.object({
  title: z.string().min(1).max(80).describe("A short session title, 2-6 words."),
  objectives: z.array(z.string().min(8).max(200)).min(2).max(5).describe("Objectives phrased with IB command terms."),
});
export type GeneratedObjectives = z.infer<typeof generatedObjectives>;

/* ---------- session review ---------- */

export const reviewOutput = z.object({
  strengths: z.array(z.string().min(10).max(300)).max(4).describe("What the student explained well. Bold key terms with **double asterisks**. Empty array if nothing was explained well."),
  weaknesses: z
    .array(z.string().min(10).max(300))
    .max(12)
    .describe("One item per objective that is not completed, including objectives never attempted, phrased as what they struggled to do or have not yet shown. Bold key terms; inline formulas in $...$."),
  annotations: z
    .array(
      z.object({
        turnIndex: z.number().int().describe("The turnIndex of the STUDENT message this comment is about."),
        type: z.enum(["positive", "negative", "neutral"]),
        comment: z.string().min(8).max(240).describe("One or two sentences a teacher would write in the margin. Bold key terms."),
      }),
    )
    .max(12)
    .describe("Margin comments on specific student turns. Not every turn needs one; comment where it teaches something."),
});
export type ReviewOutput = z.infer<typeof reviewOutput>;
