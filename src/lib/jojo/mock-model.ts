import type { LanguageModelV4CallOptions } from "@ai-sdk/provider";
import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";

/**
 * Deterministic stand-in for the real model. It reads objective ids out of the
 * system prompt and reacts to the last user message with plausible Teach Jojo
 * behaviour, so the whole product runs end to end with no credentials and the
 * tests are repeatable. Recognises which leaf is calling by the system prompt.
 */
export function createMockJojoModel() {
  return new MockLanguageModelV4({
    provider: "mock",
    modelId: "mock-jojo",
    doGenerate: async (options) => ({
      content: [{ type: "text", text: route(options) }],
      finishReason: { unified: "stop", raw: undefined },
      usage: {
        inputTokens: { total: 400, noCache: 400, cacheRead: undefined, cacheWrite: undefined },
        outputTokens: { total: 80, text: 80, reasoning: undefined },
      },
      warnings: [],
    }),
    // Streams the same JSON in small chunks with a little delay, so the UI's streaming path is exercised without a real model.
    doStream: async (options) => {
      const text = route(options);
      const chunks = text.match(/[\s\S]{1,14}/g) ?? [text];
      return {
        stream: simulateReadableStream({
          initialDelayInMs: 120,
          chunkDelayInMs: 18,
          chunks: [
            { type: "text-start" as const, id: "t1" },
            ...chunks.map((delta) => ({ type: "text-delta" as const, id: "t1", delta })),
            { type: "text-end" as const, id: "t1" },
            {
              type: "finish" as const,
              finishReason: { unified: "stop" as const, raw: undefined },
              usage: {
                inputTokens: { total: 400, noCache: 400, cacheRead: undefined, cacheWrite: undefined },
                outputTokens: { total: 80, text: 80, reasoning: undefined },
              },
            },
          ],
        }),
      };
    },
  });
}

function systemText(options: LanguageModelV4CallOptions) {
  const s = options.prompt.find((m) => m.role === "system");
  return s?.role === "system" ? s.content : "";
}

function lastUserText(options: LanguageModelV4CallOptions) {
  const last = options.prompt.filter((m) => m.role === "user").at(-1);
  return last && last.role === "user" ? last.content.map((p) => (p.type === "text" ? p.text : "")).join(" ") : "";
}

function route(options: LanguageModelV4CallOptions): string {
  const system = systemText(options);
  if (system.startsWith("Generate learning objectives")) return objectivesLeaf();
  if (system.includes("Write your FIRST message of the session")) return openingLeaf(system);
  if (system.includes("stepped aside to ask you for help")) return helpLeaf(lastUserText(options));
  if (system.includes("reviewing a Teach Jojo session")) return reviewLeaf(system);
  return turnLeaf(system, lastUserText(options));
}

function objectivesLeaf() {
  return JSON.stringify({
    title: "Custom material",
    objectives: [
      "Describe the main idea in your own words",
      "Explain why the process happens the way it does",
      "Compare this idea with a related one from the same topic",
    ],
  });
}

function openingLeaf(system: string) {
  const m = system.match(/# The first thing you want help with\n(.*)\n/);
  const text = (m?.[1] ?? "this").replace(/^(Explain|Describe|Outline|Compare|Distinguish|Evaluate)\s+/i, "").replace(/\.$/, "");
  return JSON.stringify({ response: `okay wait, i keep getting mixed up about ${text.charAt(0).toLowerCase() + text.slice(1)}\n---\ncan you start from the very beginning?` });
}

function helpLeaf(q: string) {
  const r = /osmosis|water/i.test(q)
    ? "Think about which side has more free water molecules, not more solute. Water moves to even that out. Now try saying the direction in your own words."
    : "Start from the definition and one everyday example, then say what changes when one condition flips. Take that back to Baby Jojo.";
  return JSON.stringify({ response: r });
}

function reviewLeaf(system: string) {
  const turns = [...system.matchAll(/\[turn (\d+)\] STUDENT: (.*)/g)].map((m) => ({ i: Number(m[1]), text: m[2] }));
  const good = turns.filter((t) => t.text.split(/\s+/).length > 20);
  const bad = turns.filter((t) => /more solute to (the side with )?less|needs? ATP|elastic because everyone needs|share electrons equally|kinetic energy always stays|HF has the lowest boiling/i.test(t.text) || t.text.split(/\s+/).length < 4);
  return JSON.stringify({
    strengths: good.slice(0, 2).map((t) => `You gave a clear, complete explanation when you said "${t.text.slice(0, 60)}…", using the **exact subject terms**.`),
    weaknesses: bad.slice(0, 2).map((t) =>
      t.text.split(/\s+/).length < 4
        ? "You struggled to put the idea into your own words when Jojo asked for **the first step**, and stalled instead of trying."
        : "You reversed the **direction** of the process when explaining it, which contradicts what you said earlier.",
    ),
    annotations: [
      ...good.slice(0, 2).map((t) => ({ turnIndex: t.i, type: "positive", comment: "Good job naming the **mechanism** rather than just the outcome." })),
      ...bad.slice(0, 2).map((t) => ({ turnIndex: t.i, type: "negative", comment: "This input does not address the **core idea**, so Jojo could not confirm understanding." })),
    ],
  });
}

function turnLeaf(system: string, lastText: string) {
  const ids = [...system.matchAll(/id="([^"]+)" \[([a-z_]+)\] (.*)(?:\n {4}required ideas: (.*))?/g)].map((m) => ({
    id: m[1],
    status: m[2],
    text: m[3],
    criteria: m[4] ? [...m[4].matchAll(/\[([^\]]+)\]/g)].map((c) => c[1]) : [],
  }));
  const words = lastText.trim().split(/\s+/).filter(Boolean);
  const stalled = /don'?t know|no idea|not sure|idk/i.test(lastText) || words.length < 4;
  // Mirrors the misconceptions in eval/gold.json so the harness exercises the tag path end to end.
  const wrong = /more solute to (the side with )?less|needs? ATP|elastic because everyone needs|share electrons equally|kinetic energy always stays|HF has the lowest boiling/i.test(lastText);
  const next = ids.find((o) => o.status === "in_progress") ?? ids.find((o) => o.status === "not_started");
  const completed = ids.filter((o) => o.status === "completed").length;
  const updates: { objectiveId: string; status: string }[] = [];
  let response: string;
  let confidence: "low" | "medium" | "high" = completed >= ids.length / 2 ? "medium" : "low";
  let tag: { value: string | null; reason: string } = { value: null, reason: "" };
  // Deterministic per message, so the same input always gets the same reply (tests) while a conversation does not hear one line on repeat.
  const pick = <T,>(arr: T[]) => arr[hash(lastText) % arr.length];
  const focus = next ? lowerFirst(next.text) : "the next bit";

  if (wrong) {
    response = pick([
      "wait, that doesn't match what you said before\n---\nwhich side did you say has more of the water stuff?",
      "hmm, hold on\n---\nearlier it sounded like the other way round. which one is it?",
      "okay but that feels backwards to me\n---\ncan you check the direction again?",
    ]);
    if (next) updates.push({ objectiveId: next.id, status: "in_progress" });
    tag = { value: "inaccurate", reason: "The direction described is reversed." };
  } else if (stalled) {
    response =
      words.length < 3 && !/know|sure|idea/i.test(lastText)
        ? pick(["no worries, that one's a bit scrambled\n---\ncan you say just the first part again?", "okay, i didn't quite catch that\n---\ntry just the first step for me"])
        : pick([
            `hmm okay\n---\nwhat's the very first thing that happens? just the first step`,
            `no worries, that one's tricky\n---\ncan you give me just the basic idea of ${focus}?`,
            `that's fine, start small\n---\nwhat is the one word you'd use to describe ${focus}?`,
          ]);
    if (next) updates.push({ objectiveId: next.id, status: "in_progress" });
  } else if (words.length > 22 && next) {
    const after = ids.find((o) => o.id !== next.id && o.status !== "completed");
    response = pick([
      `oh, that makes sense now\n---\nso ${firstClause(lastText)}. okay i think i can say that one back\n---\n${after ? `can you do the next bit now, ${lowerFirst(after.text)}?` : "what about the next bit?"}`,
      `yeah, i get it\n---\n${firstClause(lastText)}, right? i could explain that to someone now\n---\n${after ? `can we move on to ${lowerFirst(after.text)}?` : "is there anything else in this one?"}`,
    ]);
    updates.push({ objectiveId: next.id, status: "completed" });
    const done = completed + 1;
    confidence = done >= ids.length ? "high" : done >= ids.length / 2 ? "medium" : "low";
    tag = { value: "great", reason: "Complete and accurate explanation with the key terms." };
  } else {
    const big = words.find((w) => w.length > 9)?.replace(/[^a-z-]/gi, "");
    response = big
      ? pick([`wait. what's '${big.toLowerCase()}' mean?\n---\ncan you say that with smaller words?`, `hold on, '${big.toLowerCase()}'?\n---\ni don't know that word yet. what does it mean here?`])
      : pick([
          "okay i think i follow the first part\n---\nbut why does that happen?",
          `okay, so ${firstClause(lastText)}\n---\nbut how does that connect to ${focus}?`,
          "right, i'm with you so far\n---\nwhat happens next, after that?",
          `got it\n---\ncan you give me an example of that, like something i'd actually see?`,
        ]);
    if (next) updates.push({ objectiveId: next.id, status: "in_progress" });
    tag = { value: "good", reason: "Accurate, but not yet a complete explanation." };
  }

  // Grounded evidence: quote the student's opening words verbatim so the deterministic grounding check passes.
  const evidence = tag.value ? lastText.trim().slice(0, 120) : "";
  const canSayItBack = updates.some((u) => u.status === "completed");
  // A complete explanation covers every required idea; a partial one covers the first only, so the rubric gate holds it at in_progress.
  const covered = canSayItBack ? (next?.criteria ?? []) : tag.value === "good" && next?.criteria?.length ? [next.criteria[0]] : [];
  return JSON.stringify({ assessment: { evidence, covered, canSayItBack, tag }, objectiveUpdates: updates, confidence, response });
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1).replace(/\.$/, "");
}

function firstClause(text: string) {
  const clause = text.split(/[.;,!?]/)[0]?.trim() ?? text;
  const lower = clause.charAt(0).toLowerCase() + clause.slice(1);
  return lower.length > 90 ? `${lower.slice(0, 87)}...` : lower;
}
