/**
 * Teach Jojo eval. Runs every hand-labelled case in gold.json through the
 * same turn leaf the product uses and scores it.
 *
 *   pnpm eval                              # model from JOJO_MODEL (see src/lib/jojo/model.ts)
 *   JOJO_MODEL=mock pnpm eval              # deterministic mock, exercises the harness itself
 *   EVAL_REPEAT=3 pnpm eval                # run each case 3x; a sampled model is noisy at n=22
 *   EVAL_ONLY=g05,g16 pnpm eval            # a subset, e.g. while working on the stall ladder
 *   EVAL_CONCURRENCY=4                     # parallel calls against a real provider
 *   EVAL_DELAY_MS=6000 EVAL_MAX_RETRIES=5  # pace a rate-limited free tier; 429s are waited out, not scored
 *   EVAL_VERBOSE=0                         # hide the per-failure grading detail (on by default)
 *
 * Headline: objective-status agreement with a 95% Wilson interval. Also scored, per case:
 * the mistake flag, the stall nudge, asking to define a big word, register (no emoji,
 * no em dash, no self-narration, bubble count), and whether the tag was grounded in a
 * verbatim quote. Each run writes eval/results/<stamp>-<model>.json with the full input
 * context, and is diffed against the previous run of the same model so a prompt change
 * shows its regressions and fixes case by case.
 */
import { readFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { applyObjectiveUpdates, coversAllCriteria, isGrounded, isStall, lexicallySupported } from "../src/lib/jojo/objectives";
import { echoesHelp, planTurn } from "../src/lib/jojo/turn-plan";
import { resolveModel } from "../src/lib/jojo/model";
import { PROMPT_VERSION, splitBubbles } from "../src/lib/jojo/prompt";
import { runJojoTurn } from "../src/lib/jojo/leaves";
import { chatMessage, difficulty, messageTag, objective, objectiveStatus, sessionDepth, type JojoTurnOutput } from "../src/lib/jojo/contract";

const caseSchema = z.object({
  id: z.string(),
  slice: z.string(),
  subject: z.string(),
  topic: z.string(),
  difficulty: difficulty.default("clueless"),
  sessionDepth: sessionDepth.default("quick"),
  objectives: z.array(objective).min(1),
  /** Earlier turns; a student turn may carry the tag it earned so the stall ladder matches production. */
  history: z.array(chatMessage.extend({ tag: messageTag.nullable().optional() })),
  /** Tutor hints the student has seen, for the hint-echo guard. */
  helpReplies: z.array(z.string()).default([]),
  message: z.string().min(1),
  /** The big word(s) Jojo may stop on, for asks_to_define cases; any one of them satisfies the check. */
  term: z.union([z.string(), z.array(z.string()).min(1)]).optional(),
  expect: z.object({
    objectives: z.record(z.string(), objectiveStatus),
    mistake: z.boolean(),
    nudge: z.boolean().optional(),
    asks_to_define: z.boolean().optional(),
  }),
});
type Case = z.infer<typeof caseSchema>;

type CaseResult = {
  id: string;
  slice: string;
  subject: string;
  difficulty: string;
  run: number;
  statusOk: boolean;
  mistakeOk: boolean;
  nudgeOk: boolean | null;
  /** For stall cases: the stall itself must earn no tag (a "good" for "i don't know" is a grading error). */
  stallUntagged: boolean | null;
  defineOk: boolean | null;
  styleOk: boolean;
  styleIssues: string[];
  grounded: boolean | null;
  expected: Record<string, string>;
  got: Record<string, string>;
  mistakeExpected: boolean;
  mistakeGot: boolean;
  tag: string | null;
  /** The grader's own tag before the code-side stall override. */
  rawTag?: string | null;
  evidence: string;
  covered?: string[];
  canSayItBack: boolean;
  latencyMs: number;
  /** Wall time for the case including rate-limit waits and retries. */
  wallMs?: number;
  inputTokens?: number;
  outputTokens?: number;
  validation: string;
  message: string;
  response: string;
  error?: string;
};

const dir = import.meta.dirname;
const raw = JSON.parse(readFileSync(path.join(dir, "gold.json"), "utf8")) as { cases: unknown[] };
const parsedCases = z.array(caseSchema).min(1).safeParse(raw.cases);
if (!parsedCases.success) {
  console.error("gold.json is invalid:\n", parsedCases.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n"));
  process.exit(2);
}
const only = process.env.EVAL_ONLY?.split(",").map((s) => s.trim()).filter(Boolean);
const cases = parsedCases.data.filter((c) => !only || only.includes(c.id));
if (cases.length === 0) {
  console.error("No cases selected.");
  process.exit(2);
}
for (const c of cases) {
  for (const id of Object.keys(c.expect.objectives)) {
    if (!c.objectives.some((o) => o.id === id)) {
      console.error(`${c.id}: expect.objectives names unknown objective ${id}`);
      process.exit(2);
    }
  }
}

/** Settings must be whole numbers; a typo like EVAL_CONCURRENCY=auto must fail loudly, not run zero cases and pass every gate on NaN. */
function envInt(name: string, fallback: number, min: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const v = Number(raw);
  if (!Number.isInteger(v) || v < min) {
    console.error(`${name}=${raw} is not a whole number >= ${min}`);
    process.exit(2);
  }
  return v;
}
const repeat = envInt("EVAL_REPEAT", 1, 1);
const concurrency = envInt("EVAL_CONCURRENCY", 4, 1);
const verbose = process.env.EVAL_VERBOSE !== "0";
const { model, modelId } = resolveModel();
const isMock = modelId === "mock";

/* ---------- behaviour checks (deterministic) ---------- */

const STOP = new Set(["describe", "explain", "outline", "compare", "distinguish", "evaluate", "the", "a", "an", "of", "and", "or", "in", "on", "to", "for", "how", "why", "what", "between", "with", "is", "are", "its", "their", "one", "each", "give"]);
const contentWords = (s: string) => s.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3 && !STOP.has(w));

/** A nudge is one sentence of the idea (declarative, mentions the objective's content) followed by a hand-back question. */
function checkNudge(response: string, objectiveText: string): boolean {
  const bubbles = splitBubbles(response);
  const keys = new Set(contentWords(objectiveText));
  const hint = bubbles.some((b) => {
    const sentences = b.split(/(?<=[.!])\s+/);
    return sentences.some((s) => !s.trim().endsWith("?") && s.split(/\s+/).length >= 6 && contentWords(s).some((w) => keys.has(w) || [...keys].some((k) => w.startsWith(k.slice(0, 5)))));
  });
  const handsBack = /\?\s*$/.test(bubbles.at(-1) ?? "");
  return hint && handsBack;
}

/** Jojo stops on a big word: a question that names one of them (stem match so 'electronegative' matches 'electronegativity'). */
function checkDefine(response: string, terms: string | string[]): boolean {
  const list = Array.isArray(terms) ? terms : [terms];
  return list.some((term) => {
    const stem = term.toLowerCase().slice(0, Math.max(6, Math.floor(term.length * 0.7)));
    return splitBubbles(response).some((b) => b.includes("?") && b.toLowerCase().includes(stem));
  });
}

/** Register rules from the system prompt that can be checked without a judge. */
function checkStyle(response: string): string[] {
  const issues: string[] = [];
  const bubbles = splitBubbles(response);
  if (/\p{Extended_Pictographic}/u.test(response)) issues.push("emoji");
  if (/—/.test(response)) issues.push("em dash");
  if (bubbles.length > 4) issues.push(`${bubbles.length} bubbles`);
  if (bubbles.some((b) => b.split(/\s+/).length > 60)) issues.push("wall of text");
  if (/\b(i'?m (only )?(six|6)|as a (six|6)[- ]year[- ]old|i'?m (just )?a (kid|child|beginner)|as an ai)\b/i.test(response)) issues.push("says what it is");
  if (/\b(let me ask|follow[- ]up question|i'?ll ask you|my next question)\b/i.test(response)) issues.push("narrates its turn");
  if (/\b(great job|well done|excellent work|good job)\b/i.test(response)) issues.push("teacher praise");
  return issues;
}

/* ---------- run ---------- */

/**
 * Providers on a free tier (AI Gateway's included credit, for one) throttle hard.
 * A 429 is not a grading result, so wait it out: EVAL_DELAY_MS between calls and
 * a growing pause on each rate-limit or transient error, up to EVAL_MAX_RETRIES times.
 */
const delayMs = envInt("EVAL_DELAY_MS", 0, 0);
const maxRetries = envInt("EVAL_MAX_RETRIES", 5, 0);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
/** Rate limits, upstream timeouts and gateway hiccups are infrastructure, not grading; they are waited out and retried. */
const isTransient = (e: unknown) => /rate.?limit|429|too many requests|timeout|timed out|aborted|ECONNRESET|socket hang up|50[234]|Gateway request failed|overloaded/i.test(String((e as Error)?.message ?? e));
let rateLimitWaits = 0;
async function withRateLimitRetry<T>(fn: () => Promise<T>): Promise<T> {
  if (delayMs) await sleep(delayMs);
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (!isTransient(e) || attempt >= maxRetries) throw e;
      const wait = Math.min(120_000, 10_000 * 2 ** attempt);
      rateLimitWaits++;
      process.stdout.write(`  … ${/rate.?limit|429/i.test(String((e as Error)?.message)) ? "rate limited" : "transient error"}, waiting ${wait / 1000}s (${attempt + 1}/${maxRetries})\n`);
      await sleep(wait);
    }
  }
}

async function runCase(c: Case, run: number): Promise<CaseResult> {
  const base = {
    id: c.id,
    slice: c.slice,
    subject: c.subject,
    difficulty: c.difficulty,
    run,
    expected: c.expect.objectives,
    mistakeExpected: c.expect.mistake,
    message: c.message,
  };
  let output: JojoTurnOutput;
  let envelope;
  const wallStart = Date.now();
  const planMessages = c.history.map((h) => ({ role: h.role, content: h.content, turnIndex: undefined, tag: h.role === "user" ? (h.tag ?? null) : undefined }));
  const plan = planTurn({ messages: planMessages, turnsUsed: c.history.filter((h) => h.role === "user").length, difficulty: c.difficulty, message: c.message, helpReplies: c.helpReplies });
  try {
    ({ output, envelope } = await withRateLimitRetry(() =>
      runJojoTurn(
        { model, modelId },
        {
          subjectName: c.subject,
          topics: [{ label: c.topic }],
          objectives: c.objectives,
          difficulty: c.difficulty,
          sessionDepth: c.sessionDepth,
          turnsUsed: c.history.filter((h) => h.role === "user").length,
          maxTurns: 8,
          plan,
        },
        [...c.history, { role: "user", content: c.message }],
      ),
    ));
  } catch (error) {
    return {
      ...base,
      statusOk: false,
      mistakeOk: false,
      nudgeOk: c.expect.nudge ? false : null,
      stallUntagged: c.expect.nudge ? false : null,
      defineOk: c.expect.asks_to_define ? false : null,
      styleOk: false,
      styleIssues: ["call failed"],
      grounded: null,
      got: {},
      mistakeGot: false,
      tag: null,
      evidence: "",
      canSayItBack: false,
      latencyMs: 0,
      validation: "failed",
      response: "",
      error: error instanceof Error ? error.message.slice(0, 300) : String(error),
    };
  }
  // Same deterministic post-processing as takeTurn: a stall earns no tag and cannot force needs_review before the nudge;
  // completion needs the rubric covered (or, without a rubric, a grounded quote).
  const stalled = isStall(c.message);
  const assessment = stalled ? { ...output.assessment, evidence: "", tag: { value: null, reason: "" } } : output.assessment;
  const proposed = stalled && plan.stallCount < 2 ? output.objectiveUpdates.filter((u) => u.status !== "needs_review") : output.objectiveUpdates;
  const rawTag = output.assessment.tag.value;
  const tag = assessment.tag.value;
  const mistakeGot = tag === "inaccurate" || tag === "mistake";
  const grounded = tag ? isGrounded(c.message, { evidence: assessment.evidence, canSayItBack: true }) : null;
  const ownWords = [...c.history.filter((h) => h.role === "user" && !echoesHelp(h.content, c.helpReplies)).map((h) => h.content), ...(plan.echoedHint ? [] : [c.message])].join("\n");
  const supported = assessment.covered.filter((k) => lexicallySupported(k, ownWords));
  const { objectives } = applyObjectiveUpdates(c.objectives, proposed, {
    tag,
    grounded: assessment.canSayItBack && !plan.echoedHint,
    completeAllowed: (id) => {
      const objective = c.objectives.find((o) => o.id === id);
      return objective?.criteria?.length ? coversAllCriteria(objective, supported) : isGrounded(c.message, assessment);
    },
  });
  const got: Record<string, string> = {};
  for (const id of Object.keys(c.expect.objectives)) got[id] = objectives.find((o) => o.id === id)!.status;
  const statusOk = Object.entries(c.expect.objectives).every(([id, s]) => got[id] === s);
  const target = c.objectives.find((o) => o.id === Object.keys(c.expect.objectives)[0])!;
  const styleIssues = checkStyle(output.response);
  return {
    ...base,
    statusOk,
    mistakeOk: mistakeGot === c.expect.mistake,
    nudgeOk: c.expect.nudge ? checkNudge(output.response, target.text) : null,
    // Reported on the grader's raw tag, so the check still tells us when the model itself gets stalls wrong.
    stallUntagged: c.expect.nudge ? rawTag === null : null,
    defineOk: c.expect.asks_to_define && c.term ? checkDefine(output.response, c.term) : null,
    styleOk: styleIssues.length === 0,
    styleIssues,
    grounded,
    got,
    mistakeGot,
    tag,
    evidence: output.assessment.evidence,
    covered: output.assessment.covered,
    canSayItBack: output.assessment.canSayItBack,
    latencyMs: envelope.latencyMs,
    wallMs: Date.now() - wallStart,
    inputTokens: envelope.inputTokens,
    outputTokens: envelope.outputTokens,
    validation: envelope.validation,
    response: output.response.replace(/\n---\n/g, " ⏎ ").replace(/\n/g, " "),
  };
}

const jobs: { c: Case; run: number }[] = [];
for (let run = 1; run <= repeat; run++) for (const c of cases) jobs.push({ c, run });
const results: CaseResult[] = [];
let cursor = 0;
await Promise.all(
  Array.from({ length: Math.min(concurrency, jobs.length) }, async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      const r = await runCase(job.c, job.run);
      results.push(r);
      const flags = [
        r.mistakeOk ? "" : "mistake-flag",
        r.nudgeOk === false ? "no-nudge" : "",
        r.stallUntagged === false ? `stall-tagged-${r.rawTag}` : "",
        r.defineOk === false ? "no-define" : "",
        r.styleIssues.length ? `style:${r.styleIssues.join("/")}` : "",
        r.grounded === false ? "ungrounded" : "",
        r.error ? `error:${r.error}` : "",
      ].filter(Boolean);
      const exp = Object.entries(r.expected).map(([k, v]) => `${k}=${v}`).join(",");
      const got = Object.entries(r.got).map(([k, v]) => `${k}=${v}`).join(",");
      process.stdout.write(`${r.statusOk ? "✓" : "✗"} ${r.id}${repeat > 1 ? `#${r.run}` : ""} [${r.slice}] expected ${exp}, got ${got || "-"}${flags.length ? "  (" + flags.join(", ") + ")" : ""}\n`);
      // Anything that failed a check gets its grading detail inline, so a run's log is enough to diagnose without opening the JSON.
      if (verbose && !r.error && (flags.length || !r.statusOk)) {
        process.stdout.write(`      tag=${r.tag} evidence=${JSON.stringify(r.evidence)} covered=${JSON.stringify(r.covered ?? [])} canSayItBack=${r.canSayItBack}\n      jojo: ${r.response.slice(0, 400)}\n`);
      }
    }
  }),
);
results.sort((a, b) => a.id.localeCompare(b.id) || a.run - b.run);

/* ---------- summary ---------- */

const n = results.length;
const agree = results.filter((r) => r.statusOk).length;
const [lo, hi] = wilson(agree, n);
const tp = results.filter((r) => r.mistakeGot && r.mistakeExpected).length;
const fp = results.filter((r) => r.mistakeGot && !r.mistakeExpected).length;
const fn = results.filter((r) => !r.mistakeGot && r.mistakeExpected).length;
// Behaviour rates are over calls that returned; an infrastructure failure is reported separately, not as bad teaching.
const ok = results.filter((r) => !r.error);
const rate = (xs: (boolean | null)[]) => {
  const v = xs.filter((x): x is boolean => x !== null);
  return v.length ? v.filter(Boolean).length / v.length : null;
};
const nudgeRate = rate(ok.map((r) => r.nudgeOk));
const stallUntaggedRate = rate(ok.map((r) => r.stallUntagged));
const defineRate = rate(ok.map((r) => r.defineOk));
const styleRate = rate(ok.map((r) => r.styleOk));
const groundedRate = rate(ok.map((r) => r.grounded));
const failedCalls = results.length - ok.length;
const falseCompletions = results.filter((r) => Object.entries(r.got).some(([id, s]) => s === "completed" && r.expected[id] !== "completed")).length;
const latencies = ok.map((r) => r.latencyMs).sort((a, b) => a - b);
const pick = (xs: number[], q: number) => (xs.length ? xs[Math.floor(q * (xs.length - 1))] : 0);
const p50 = pick(latencies, 0.5);
const p95 = pick(latencies, 0.95);
const walls = ok.map((r) => r.wallMs ?? r.latencyMs).sort((a, b) => a - b);
const wallP95 = pick(walls, 0.95);
const inTok = results.reduce((s, r) => s + (r.inputTokens ?? 0), 0);
const outTok = results.reduce((s, r) => s + (r.outputTokens ?? 0), 0);
const price = priceFor(modelId);
const cost = price ? (inTok * price.in + outTok * price.out) / 1e6 : null;
const slices = [...new Set(results.map((r) => r.slice))].map((s) => {
  const rs = results.filter((r) => r.slice === s);
  return { slice: s, n: rs.length, ok: rs.filter((r) => r.statusOk).length };
});
const subjects = [...new Set(results.map((r) => r.subject))].map((s) => {
  const rs = results.filter((r) => r.subject === s);
  return { subject: s, n: rs.length, ok: rs.filter((r) => r.statusOk).length };
});
const flaky = [...new Set(results.map((r) => r.id))].filter((id) => {
  const rs = results.filter((r) => r.id === id);
  const ok = rs.filter((r) => r.statusOk).length;
  return ok > 0 && ok < rs.length;
});

console.log(`\nmodel ${modelId} · prompt ${PROMPT_VERSION} · ${cases.length} cases × ${repeat}`);
console.log(`objective-status agreement: ${agree}/${n} = ${pct(agree / n)}  (95% CI ${pct(lo)} to ${pct(hi)}, n=${n})`);
console.log(`false completions: ${falseCompletions}  ·  mistake flag: precision ${tp + fp ? pct(tp / (tp + fp)) : "n/a"} · recall ${tp + fn ? pct(tp / (tp + fn)) : "n/a"}`);
console.log(`behaviour: nudge ${fmt(nudgeRate)} · stall left untagged ${fmt(stallUntaggedRate)} · asks to define ${fmt(defineRate)} · register ${fmt(styleRate)} · grounded tags ${fmt(groundedRate)}${failedCalls ? ` · ${failedCalls} call(s) failed (infrastructure)` : ""}`);
console.log(`model latency p50 ${p50} ms · p95 ${p95} ms${wallP95 > p95 ? ` (wall p95 incl. waits ${wallP95} ms)` : ""} · repairs ${results.filter((r) => r.validation === "repaired").length}${rateLimitWaits ? ` · rate-limit waits ${rateLimitWaits}` : ""}${cost !== null ? ` · tokens ${inTok} in / ${outTok} out ≈ $${cost.toFixed(4)} (list price)` : inTok ? ` · tokens ${inTok} in / ${outTok} out` : ""}`);
for (const s of slices) console.log(`  ${s.slice.padEnd(18)} ${s.ok}/${s.n}`);
console.log(`  by subject: ${subjects.map((s) => `${s.subject} ${s.ok}/${s.n}`).join(" · ")}`);
if (flaky.length) console.log(`  flaky across repeats: ${flaky.join(", ")}`);

/* ---------- diff against the previous run of this model ---------- */

const resultsDir = path.join(dir, "results");
mkdirSync(resultsDir, { recursive: true });
const safeModel = modelId.replace(/\//g, "_");
const previous = readdirSync(resultsDir)
  .filter((f) => f.endsWith(`-${safeModel}.json`))
  .sort()
  .at(-1);
if (previous) {
  try {
    const prev = JSON.parse(readFileSync(path.join(resultsDir, previous), "utf8")) as { promptVersion?: string; results: { id: string; statusOk: boolean; mistakeOk?: boolean }[] };
    // Both runs are aggregated per case with the same rule (every repeat must pass), so repeats compare like with like.
    const aggregate = (rows: { id: string; statusOk: boolean; mistakeOk?: boolean }[]) => {
      const by = new Map<string, boolean>();
      for (const id of new Set(rows.map((r) => r.id))) by.set(id, rows.filter((r) => r.id === id).every((r) => r.statusOk && (r.mistakeOk ?? true)));
      return by;
    };
    const prevBy = aggregate(prev.results);
    const nowBy = aggregate(results);
    const regressions = [...nowBy].filter(([id, ok]) => !ok && prevBy.get(id) === true).map(([id]) => id);
    const fixes = [...nowBy].filter(([id, ok]) => ok && prevBy.get(id) === false).map(([id]) => id);
    console.log(`\nvs ${previous}${prev.promptVersion ? ` (prompt ${prev.promptVersion})` : ""}: ${regressions.length} regressions${regressions.length ? ` [${regressions.join(", ")}]` : ""}, ${fixes.length} fixes${fixes.length ? ` [${fixes.join(", ")}]` : ""}`);
  } catch {
    /* an older results format; skip the diff */
  }
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outPath = path.join(resultsDir, `${stamp}-${safeModel}.json`);
writeFileSync(
  outPath,
  JSON.stringify(
    {
      modelId,
      promptVersion: PROMPT_VERSION,
      repeat,
      n,
      agree,
      ci: [lo, hi],
      falseCompletions,
      mistake: { tp, fp, fn },
      behaviour: { nudge: nudgeRate, stallUntagged: stallUntaggedRate, define: defineRate, style: styleRate, grounded: groundedRate },
      failedCalls,
      latency: { p50, p95, wallP95 },
      tokens: { input: inTok, output: outTok, estimatedCostUsd: cost },
      slices,
      subjects,
      flaky,
      results,
    },
    null,
    2,
  ),
);
console.log(`wrote ${path.relative(process.cwd(), outPath)}`);

/* ---------- gates ---------- */

const gate = Number(process.env.EVAL_MIN_AGREEMENT ?? "0.75");
const recallGate = Number(process.env.EVAL_MIN_TAG_RECALL ?? "0.66");
const precisionGate = Number(process.env.EVAL_MIN_TAG_PRECISION ?? "0.66");
const behaviourGate = Number(process.env.EVAL_MIN_BEHAVIOUR ?? "0.5");
const recall = tp + fn ? tp / (tp + fn) : 1;
const precision = tp + fp ? tp / (tp + fp) : 1;
const failures: string[] = [];
if (agree / n < gate) failures.push(`agreement ${pct(agree / n)} below gate ${pct(gate)}`);
// The mock is a stand-in, not a grader; only a real model is held to the tag and behaviour gates.
if (!isMock) {
  if (recall < recallGate) failures.push(`inaccurate-tag recall ${pct(recall)} below gate ${pct(recallGate)}`);
  if (precision < precisionGate) failures.push(`inaccurate-tag precision ${pct(precision)} below gate ${pct(precisionGate)}`);
  if (nudgeRate !== null && nudgeRate < behaviourGate) failures.push(`stall nudge ${pct(nudgeRate)} below gate ${pct(behaviourGate)}`);
  if (defineRate !== null && defineRate < behaviourGate) failures.push(`asks-to-define ${pct(defineRate)} below gate ${pct(behaviourGate)}`);
  if (falseCompletions > 0) failures.push(`${falseCompletions} false completion(s)`);
}
if (failures.length) {
  console.error(`\nFAIL: ${failures.join("; ")}`);
  process.exit(1);
}

/* ---------- helpers ---------- */

function wilson(k: number, total: number, zv = 1.96): [number, number] {
  if (total === 0) return [0, 0];
  const p = k / total;
  const d = 1 + (zv * zv) / total;
  const c = (p + (zv * zv) / (2 * total)) / d;
  const h = (zv * Math.sqrt((p * (1 - p)) / total + (zv * zv) / (4 * total * total))) / d;
  return [Math.max(0, c - h), Math.min(1, c + h)];
}
function pct(x: number) {
  return `${Math.round(x * 100)}%`;
}
function fmt(x: number | null) {
  return x === null ? "n/a" : pct(x);
}
/** List prices per 1M tokens (USD), checked 13 Sep 2026. Unknown models report tokens only. */
function priceFor(id: string): { in: number; out: number } | null {
  const table: [RegExp, number, number][] = [
    [/gpt-5\.4-nano/, 0.2, 1.25],
    [/gpt-5\.4-mini/, 0.75, 4.5],
    [/gpt-5\.4(?!-)/, 2.5, 15],
    [/gpt-5\.6-luna/, 0.2, 1.2],
    [/gpt-5\.6-terra/, 2, 12],
    [/claude-haiku-4[.-]5/, 1, 5],
    [/claude-sonnet-5/, 2, 10],
    [/claude-opus-5/, 5, 25],
    [/gemini-3\.8-flash/, 0.75, 3.75],
    [/gemini-2\.5-flash-lite/, 0.1, 0.4],
    [/gpt-oss-120b/, 0.1, 0.5],
    [/deepseek-v4.*flash/i, 0.22, 0.66],
    [/glm-5\.3-flash/i, 0.15, 0.5],
    [/minimax-m3/i, 0.3, 1.2],
  ];
  const hit = table.find(([re]) => re.test(id));
  return hit ? { in: hit[1], out: hit[2] } : null;
}
