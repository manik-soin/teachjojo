import { generateText } from "ai";

// AI Gateway smoke test. The `ai` package routes `<provider>/<model>` ids through
// Vercel AI Gateway when AI_GATEWAY_API_KEY is set (or OIDC on Vercel).
//   node --env-file=.env.local index.mts            (MODEL=<provider>/<model> overrides the default)
if (!process.env.AI_GATEWAY_API_KEY) {
  console.error("AI_GATEWAY_API_KEY is not set. Run with: node --env-file=.env.local index.mts");
  process.exit(1);
}

const { text, usage, response } = await generateText({
  model: process.env.MODEL ?? "openai/gpt-5.6-sol",
  prompt: "In one sentence, tell a student why explaining a topic to someone else helps them learn it.",
});

console.log(text);
console.log(`\n[${response.modelId}] ${usage.inputTokens} in / ${usage.outputTokens} out`);
