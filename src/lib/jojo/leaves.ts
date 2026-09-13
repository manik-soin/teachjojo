import { generateText, NoObjectGeneratedError, Output, streamText } from "ai";
import type { LanguageModel } from "ai";
import type { z } from "zod";
import {
  generatedObjectives,
  helpOutput,
  jojoTurnOutput,
  openingOutput,
  reviewOutput,
  type ChatMessage,
  type GeneratedObjectives,
  type JojoTurnOutput,
  type OpeningOutput,
  type ReviewOutput,
} from "./contract";
import { buildHelpPrompt, buildOpeningPrompt, buildReviewPrompt, buildSystemPrompt, PROMPT_VERSION, toModelMessages, type PromptContext } from "./prompt";

/**
 * The model leaves. Each is one bounded question in, one typed value out, with
 * validation, a single repair attempt and a call envelope. Deterministic code
 * around them owns everything else.
 */

export type CallEnvelope = {
  modelId: string;
  promptVersion: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs: number;
  validation: "ok" | "repaired" | "failed";
};

type Leaf<T> = { output: T; envelope: CallEnvelope };
type ModelRef = { model: LanguageModel; modelId: string };

/** Sessions cap at 24 turns (48 messages), so the whole transcript always fits. */
const HISTORY_WINDOW = 48;
/**
 * Budget: the chat route allows 60 s. A streamed attempt may be retried twice by
 * the SDK on a 429 or 5xx (the free gateway tier throttles per model), each
 * attempt capped at 15 s, then one repair call with no retry (12 s), leaving
 * margin for the DB round trips. Stale-claim release (repo.ts) is 180 s.
 */
const CALL_TIMEOUT_MS = 15_000;
const REPAIR_TIMEOUT_MS = 12_000;
const STREAM_RETRIES = 2;

async function callStructured<S extends z.ZodTypeAny>(
  ref: ModelRef,
  args: { system: string; messages?: { role: "user" | "assistant"; content: string }[]; prompt?: string; schema: S; temperature?: number; maxOutputTokens?: number },
): Promise<Leaf<z.infer<S>>> {
  const started = Date.now();
  const run = (repair?: string) =>
    generateText({
      model: ref.model,
      system: repair ? `${args.system}\n\n# Correction\n${repair}` : args.system,
      ...(args.messages ? { messages: args.messages } : { prompt: args.prompt ?? "" }),
      output: Output.object({ schema: args.schema }),
      temperature: args.temperature ?? 0.7,
      maxOutputTokens: args.maxOutputTokens ?? 700,
      maxRetries: repair ? 0 : 1,
      abortSignal: AbortSignal.timeout(repair ? REPAIR_TIMEOUT_MS : CALL_TIMEOUT_MS),
    });

  let validation: CallEnvelope["validation"] = "ok";
  let result: Awaited<ReturnType<typeof run>>;
  try {
    result = await run();
  } catch (error) {
    if (!NoObjectGeneratedError.isInstance(error)) throw error;
    validation = "repaired";
    result = await run("Your previous reply did not match the required JSON schema. Reply with only the JSON object described.");
  }
  if (!result.output) throw new Error("Model produced no output after repair.");

  return {
    output: result.output as z.infer<S>,
    envelope: {
      modelId: ref.modelId,
      promptVersion: PROMPT_VERSION,
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      latencyMs: Date.now() - started,
      validation,
    },
  };
}

export function runJojoTurn(ref: ModelRef, context: PromptContext, history: ChatMessage[]): Promise<Leaf<JojoTurnOutput>> {
  return callStructured(ref, {
    system: buildSystemPrompt(context),
    messages: toModelMessages(history.slice(-HISTORY_WINDOW)),
    schema: jojoTurnOutput,
  });
}

/**
 * Same contract as `runJojoTurn`, but Jojo's `response` text is surfaced as it
 * streams so the UI can grow the bubbles. The structured object is still
 * validated whole at the end; if the stream fails validation we fall back to
 * one non-streaming call, which counts as the repair attempt.
 */
export async function runJojoTurnStreaming(
  ref: ModelRef,
  context: PromptContext,
  history: ChatMessage[],
  onPartialResponse: (text: string) => void,
): Promise<Leaf<JojoTurnOutput>> {
  const started = Date.now();
  const system = buildSystemPrompt(context);
  const messages = toModelMessages(history.slice(-HISTORY_WINDOW));

  try {
    const result = streamText({
      model: ref.model,
      system,
      messages,
      output: Output.object({ schema: jojoTurnOutput }),
      temperature: 0.7,
      maxOutputTokens: 700,
      maxRetries: STREAM_RETRIES,
      abortSignal: AbortSignal.timeout(CALL_TIMEOUT_MS * (STREAM_RETRIES + 1)),
    });
    let last = "";
    for await (const partial of result.partialOutputStream) {
      const text = typeof partial?.response === "string" ? partial.response : "";
      if (text && text !== last) {
        last = text;
        onPartialResponse(text);
      }
    }
    const output = await result.output;
    const usage = await result.usage;
    return {
      output,
      envelope: { modelId: ref.modelId, promptVersion: PROMPT_VERSION, inputTokens: usage.inputTokens, outputTokens: usage.outputTokens, latencyMs: Date.now() - started, validation: "ok" },
    };
  } catch (error) {
    if (!NoObjectGeneratedError.isInstance(error)) throw error;
    const repaired = await callStructured(ref, {
      system: `${system}\n\n# Correction\nYour previous reply did not match the required JSON schema. Reply with only the JSON object described.`,
      messages,
      schema: jojoTurnOutput,
    });
    return { output: repaired.output, envelope: { ...repaired.envelope, latencyMs: Date.now() - started, validation: "repaired" } };
  }
}

export function runHelpTurn(ref: ModelRef, context: PromptContext, mainTranscript: ChatMessage[], helpHistory: ChatMessage[]) {
  return callStructured(ref, {
    system: buildHelpPrompt(context, mainTranscript),
    messages: toModelMessages(helpHistory.slice(-10)),
    schema: helpOutput,
    temperature: 0.5,
  });
}

/** Baby Jojo's opening message for a new session, in character, about the first objective. */
export function runOpening(ref: ModelRef, context: Pick<PromptContext, "subjectName" | "topics" | "objectives" | "difficulty">): Promise<Leaf<OpeningOutput>> {
  return callStructured(ref, {
    system: buildOpeningPrompt(context),
    prompt: "Write your first message now.",
    schema: openingOutput,
    temperature: 0.8,
    maxOutputTokens: 200,
  });
}

export function runObjectiveGeneration(ref: ModelRef, subjectName: string, material: string): Promise<Leaf<GeneratedObjectives>> {
  return callStructured(ref, {
    system: [
      "Generate learning objectives for an IB revision session where a student will teach the material to a clueless learner.",
      `Subject: ${subjectName}.`,
      "Write 2-5 objectives, each starting with an IB command term (Describe, Explain, Outline, Compare, Distinguish, Evaluate). Each must be checkable from a spoken explanation alone.",
      "Also produce a short title (2-6 words) naming the topic.",
    ].join("\n"),
    prompt: `Student's description of what they want to review:\n"""\n${material.trim()}\n"""`,
    schema: generatedObjectives,
    temperature: 0.3,
  });
}

export function runReview(
  ref: ModelRef,
  context: PromptContext,
  transcript: { turnIndex: number; role: "user" | "assistant"; content: string }[],
): Promise<Leaf<ReviewOutput>> {
  return callStructured(ref, {
    system: buildReviewPrompt(context, transcript),
    prompt: "Write the review now.",
    schema: reviewOutput,
    temperature: 0.4,
    maxOutputTokens: 1600,
  });
}
