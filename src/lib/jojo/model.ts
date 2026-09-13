import { createAnthropic } from "@ai-sdk/anthropic";
import { createFireworks } from "@ai-sdk/fireworks";
import { gateway } from "@ai-sdk/gateway";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";
import { createMockJojoModel } from "./mock-model";

/**
 * One place decides which model answers. Model ids use the `<provider>/<model>`
 * form that Vercel AI Gateway and OpenRouter share, so switching models is one
 * env var and the eval can compare providers on the same gold set.
 *
 *  JOJO_MODEL=mock                          deterministic mock (tests, CI, demo without credentials)
 *  JOJO_MODEL=openai/gpt-5.4-mini           default
 *  JOJO_MODEL=anthropic/claude-sonnet-5, google/gemini-3.8-flash, fireworks/accounts/fireworks/models/gpt-oss-120b, ...
 *
 *  JOJO_PROVIDER=auto (default) picks the route in this order:
 *    1. a direct key for the model's provider   OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, FIREWORKS_API_KEY
 *    2. OPENROUTER_API_KEY                      any catalogued model, OpenRouter's fee on credit top-ups
 *    3. Vercel AI Gateway                       AI_GATEWAY_API_KEY locally, OIDC on Vercel; needs a card on the team
 *  JOJO_PROVIDER=direct | openrouter | gateway forces one route.
 *  Nothing usable: mock in development, a loud startup error in production.
 */
export const DEFAULT_MODEL_ID = "openai/gpt-5.4-mini";

export type ResolvedModel = { model: LanguageModel; modelId: string; isMock: boolean; route: "mock" | "direct" | "openrouter" | "gateway" };

const DIRECT_KEYS: Record<string, string> = {
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  google: "GOOGLE_GENERATIVE_AI_API_KEY",
  fireworks: "FIREWORKS_API_KEY",
};

export function resolveModel(): ResolvedModel {
  const requested = process.env.JOJO_MODEL?.trim();
  if (requested === "mock") return mock();

  const id = requested || DEFAULT_MODEL_ID;
  const slash = id.indexOf("/");
  const provider = slash > 0 ? id.slice(0, slash) : "";
  const bare = slash > 0 ? id.slice(slash + 1) : id;
  const forced = process.env.JOJO_PROVIDER?.trim() || "auto";

  const directKey = DIRECT_KEYS[provider] ? process.env[DIRECT_KEYS[provider]] : undefined;
  if ((forced === "auto" || forced === "direct") && directKey) return { model: direct(provider, bare, directKey), modelId: id, isMock: false, route: "direct" };
  if ((forced === "auto" || forced === "openrouter") && process.env.OPENROUTER_API_KEY) {
    const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
    return { model: openrouter.chat(id), modelId: id, isMock: false, route: "openrouter" };
  }
  if ((forced === "auto" || forced === "gateway") && hasGatewayCredentials()) return { model: gateway(id), modelId: id, isMock: false, route: "gateway" };

  if (forced !== "auto") throw new Error(`JOJO_PROVIDER=${forced} but its credentials are missing for ${id}.`);
  // Development without credentials demos on the mock. A production deployment must choose explicitly:
  // JOJO_MODEL=mock for a demo, or credentials for one of the routes above.
  if (process.env.NODE_ENV === "production") {
    throw new Error("No model configured. Set JOJO_MODEL=mock for a demo deployment, or provide a provider key, OPENROUTER_API_KEY, or AI Gateway credentials.");
  }
  return mock();
}

function direct(provider: string, bare: string, apiKey: string): LanguageModel {
  switch (provider) {
    case "openai":
      return createOpenAI({ apiKey })(bare);
    case "anthropic":
      return createAnthropic({ apiKey })(bare);
    case "google":
      return createGoogleGenerativeAI({ apiKey })(bare);
    case "fireworks":
      return createFireworks({ apiKey })(bare);
    default:
      throw new Error(`No direct provider for ${provider}.`);
  }
}

function mock(): ResolvedModel {
  return { model: createMockJojoModel(), modelId: "mock", isMock: true, route: "mock" };
}

export function hasGatewayCredentials(): boolean {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || process.env.VERCEL);
}
