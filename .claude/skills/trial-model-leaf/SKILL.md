---
name: trial-model-leaf
description: Implement or review a call to a language model as a testable leaf — one bounded question, a typed output contract, validation with one repair, a pinned version, a whole-tuple cache key, and a logged call envelope. Use when adding or reviewing any inference call, replacing a stubbed model middle, or when asked how to make AI code testable.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# The model as a leaf

The most common architectural mistake in an AI feature is letting the
probabilistic part control the flow. An agent that decides what to query, in
what order, and whether to retry has made the whole system untestable: every
bug reproduces only sometimes and every fix is an untested prompt change.

Push the model to the **leaves**. Orchestration, validation, retries,
permissions, billing and persistence are ordinary deterministic code with
ordinary tests. The model answers one bounded question and returns a typed value
that is checked before anything acts on it.

`references/leaf-sketch.md` has the wrapper shape and a TypeScript rendering.
Read it when implementing; skip it when reviewing.

## Two modes

**Build mode** — replacing the fake from `trial-slice`. Work the checklist in
order behind the *same* contract; the slice test must still pass with the fake
injected, and a second test must pass with a recorded real response.

**Review mode** — asked to assess existing inference code. Grep for the SDK
calls, then return a table: one row per call site, eight columns, ✓ / ✗ / partial.
The ✗ cells are the findings. Do not fix anything in review mode.

## The eight-point checklist

### 1. One bounded question
The call does not decide what happens next: no tool choice, no next step, no
whether-to-charge. An enum plus evidence is the right shape.

### 2. A typed output contract
Schema next to the call. Narrowest type the domain allows — an enum over a
string, an integer band over a float score. A type that cannot represent a wrong
answer beats a validator that rejects one.

### 3. Validate before acting, with one repair
```
parse → schema → domain invariant (do the cited spans exist in the source?) → act
   ↓ fail: ONE repair with the error text fed back, then fail and surface it
```
Unbounded repair loops burn money on a model that is stably wrong.

### 4. Pin the version
A floating alias means behaviour changes overnight with no deploy and no diff.
Pin the id, record it on every call.

### 5. Key the cache on the whole input tuple
```
key = hash(content_hash, rubric_revision, prompt_version, model_id,
           decoding_params, output_schema_version)
```
State the invariant: *the key contains everything that can change the answer.*
Then invalidation is not a mechanism you build — a change makes a new key, old
rows stay readable, and the tuple is what makes a result reproducible.

### 6. Log the envelope, not just the answer
One row per call: inputs by reference, resolved versions, raw response, parsed
value, validation path taken, latency, tokens, cost. Append-only. This is the
eval corpus written down before you need it.

### 7. Bound the blast radius
Per-run ceiling on calls, tokens and wall time, enforced by the orchestrator,
returning partial results when hit. Timeout per call. Retries capped at two with
jitter. A monthly spend cap is a fuse, not a control.

### 8. Decide how it fails, and write it down
Closed (refuse, defer to a human, show evidence gathered) or open (degrade
honestly). Per feature, not globally. Decision-shaped fails closed; conversation
fails open. Record it with `trial-fork-log`.

## Prompt assembly, briefly

- Instructions and criteria first, the material being judged last.
- One criterion's rubric, not the whole rubric. Six descriptor sets at once
  measurably degrade each one.
- Require spans into the source; verify mechanically that they exist.
- User-written text is untrusted. Assume injection succeeds and make success
  worthless: typed output, no tools, no write access. Fix it at the authority,
  not the input.

## What to say

> "The model sits at a leaf. Orchestration and validation are deterministic so I
> can unit test them offline; the model gets one bounded question and returns a
> typed value I check before acting on it. The cache key is the whole input
> tuple, so a rubric change produces a new key rather than a stale answer."

## Time box

Ninety minutes from a green slice. If the real call is not behind the contract
by then, ship the fake, log it as deliberately not built, and move to
`trial-gold-set`. A measured fake beats an unmeasured model.

## Done when

- Slice test passes with the fake injected; a second test passes with a recorded
  real response; neither touches the network.
- The eight points are ✓ or explicitly logged as a cut in `ASSUMPTIONS.md`.
- A cache-key test proves the key changes when each tuple member changes.

Then `trial-gold-set`, because none of the above says whether the answers are
any good.
