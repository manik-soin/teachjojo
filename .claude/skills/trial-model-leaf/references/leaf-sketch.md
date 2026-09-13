# The leaf wrapper, sketched

Language-neutral shape first, then a TypeScript rendering. Adapt names to the
repo; keep the *order* of steps, because the order is the design.

## Shape

```
grade(input, ctx) -> Result<Output, LeafError>

  1  key      = hash(input.content_hash, ctx.rubric_rev, PROMPT_VERSION,
                     MODEL_ID, DECODING, SCHEMA_VERSION)
  2  hit      = store.get(key)            → return hit (mark envelope.cached=true)
  3  prompt   = assemble(criterion, rubric_slice, input.text)   # instructions first, material last
  4  raw      = model.call(MODEL_ID, prompt, DECODING, timeout)
  5  parsed   = parse(raw) ▷ schema.validate ▷ invariants(input)
       on fail: ONE repair call with the error text appended; re-run 5; then fail
  6  envelope = { key, input_ref, versions, raw, parsed, path, ms, tokens, cost }
  7  store.append(envelope)               # append-only; "latest" is a projection
  8  return parsed | LeafError{ kind: "invalid" | "timeout" | "budget", envelope }
```

Everything outside `model.call` is deterministic and unit-testable with the
fake from `trial-slice` injected as `model`.

## TypeScript rendering

```ts
import { z } from "zod";
import { createHash } from "node:crypto";

export const PROMPT_VERSION = "grade-c.v3";
export const MODEL_ID = "claude-sonnet-5";           // pinned, never an alias
export const DECODING = { temperature: 0, max_tokens: 400 } as const;
export const SCHEMA_VERSION = 2;

export const Verdict = z.object({
  band: z.number().int().min(1).max(7),               // narrowest type the domain allows
  evidence: z.array(z.string().min(8)).min(1).max(3), // spans that must appear in the source
});
export type Verdict = z.infer<typeof Verdict>;

export type LeafError =
  | { kind: "invalid"; detail: string; envelopeId: string }
  | { kind: "timeout"; envelopeId: string }
  | { kind: "budget"; envelopeId: string };

export type Model = (prompt: string, opts: typeof DECODING & { model: string }) =>
  Promise<{ text: string; tokens: { in: number; out: number } }>;

export function cacheKey(contentHash: string, rubricRev: string) {
  return createHash("sha256")
    .update([contentHash, rubricRev, PROMPT_VERSION, MODEL_ID,
             JSON.stringify(DECODING), SCHEMA_VERSION].join("|"))
    .digest("hex");
}

function invariants(v: Verdict, source: string): string | null {
  const missing = v.evidence.filter(e => !source.includes(e));
  return missing.length ? `evidence not found in source: ${JSON.stringify(missing)}` : null;
}

export async function gradeCriterion(
  input: { contentHash: string; text: string; rubricRev: string; rubricSlice: string },
  deps: { model: Model; store: Store; budget: Budget; now: () => number },
): Promise<Verdict | LeafError> {
  const key = cacheKey(input.contentHash, input.rubricRev);
  const hit = await deps.store.latest(key);
  if (hit) return hit.parsed;

  if (!deps.budget.take()) return { kind: "budget", envelopeId: "" };

  const prompt = assemble(input.rubricSlice, input.text);      // criteria first, material last
  const t0 = deps.now();
  let raw = await deps.model(prompt, { ...DECODING, model: MODEL_ID });
  let path: "ok" | "repaired" | "invalid" = "ok";

  let parsed = tryParse(raw.text, input.text);
  if (!parsed.ok) {                                              // exactly one repair
    path = "repaired";
    raw = await deps.model(prompt + `\n\nYour previous answer was rejected: ${parsed.error}. Return only valid JSON.`,
                           { ...DECODING, model: MODEL_ID });
    parsed = tryParse(raw.text, input.text);
    if (!parsed.ok) path = "invalid";
  }

  const env = await deps.store.append({
    key, inputRef: input.contentHash, rubricRev: input.rubricRev,
    promptVersion: PROMPT_VERSION, modelId: MODEL_ID, decoding: DECODING, schemaVersion: SCHEMA_VERSION,
    raw: raw.text, parsed: parsed.ok ? parsed.value : null, path,
    ms: deps.now() - t0, tokens: raw.tokens, costUsd: cost(raw.tokens),
  });

  return parsed.ok ? parsed.value : { kind: "invalid", detail: parsed.error, envelopeId: env.id };
}

function tryParse(text: string, source: string):
  { ok: true; value: Verdict } | { ok: false; error: string } {
  let json: unknown;
  try { json = JSON.parse(text); } catch (e) { return { ok: false, error: `not JSON: ${String(e)}` }; }
  const r = Verdict.safeParse(json);
  if (!r.success) return { ok: false, error: r.error.issues.map(i => i.message).join("; ") };
  const inv = invariants(r.data, source);
  return inv ? { ok: false, error: inv } : { ok: true, value: r.data };
}
```

## The tests this shape makes possible

- `cacheKey` changes when any of the six inputs change, and only then.
- With the fake model returning fixed JSON: happy path, one repair, two failures
  → `invalid`, budget exhausted → `budget`, evidence-not-in-source → repair.
- The envelope row exists after every call including failures.
- None of these tests touch the network. That sentence is the demo.
