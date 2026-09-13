---
name: trial-slice
description: Build the thinnest end-to-end vertical slice with a hardcoded middle and a test written first, so an integration is proven before any real work starts. Use at the beginning of implementation, when a task risks producing impressive fragments that do not connect, or when you need something demonstrable early.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# Vertical slice

A working pipeline with a fake middle beats a perfect middle with no ends.
Build the ends first. Budget: thirty minutes. Hard stop at forty-five.

## 0. Is there a test runner?

Check what `trial-seam-map` reported. If the repo has a runner, use it. If it
does not, **do not install one** — a single script with assertions and a
non-zero exit is a test. Setting up a test framework in an unfamiliar repo is
the most common way the first hour disappears.

## 1. The test, before the implementation

Write the test and **run it**, and confirm it fails for the right reason.

> Write a failing test for: given `<input>`, `<entrypoint>` returns `<typed
> shape>`. Do not write the implementation. Run it and show the failure — it
> must fail because the function is unimplemented, not because an import path
> is wrong.

A test that fails for the wrong reason hides a misunderstanding that costs an
hour later. Fix the reason before writing a line of implementation.

## 2. Freeze the contract

Input type, output type, error type, in **one file**. The fake, the real
implementation, the test and the eval row all agree with this file or do not
compile. Include the failure shape: an output type that cannot express "I could
not grade this" forces every later failure to lie.

Fixed interfaces are also what make parallel work safe later. Without them,
parallel agents produce plausible middles that do not compose.

## 3. Fake the middle, honestly

Replace the expensive part with a constant that satisfies the contract.

```ts
// FAKE: fixed response satisfying the Verdict contract.
// Replaced by trial-model-leaf; kept as the offline fixture afterwards.
```

- The fake returns the **same shape** the real thing will, including the
  failure shape. Make it switchable so one test exercises the failure path.
- The fake **stays** after the real thing lands, behind a flag or as an injected
  dependency. It is the fixture that keeps every other test fast, offline and
  deterministic. That is why this step is an investment, not scaffolding.

## 4. Run it end to end, commit, tag

Request in, persisted, rendered out. Then:

```bash
git add -A && git commit -m "slice: end-to-end path with faked middle"
git tag slice-green
```

From here main never gets worse than a working demo. If the rest of the day
goes wrong, `git checkout slice-green` still has something to show.

## 5. Say what you did

> "The whole path runs with the model call stubbed, so the integration is proven
> and I always have something to demo. Now I am replacing the middle."

## Anti-patterns that eat the slice

- Installing a test framework, ORM, or UI library "first".
- Starting with the prompt. The prompt is the middle.
- A fake that only models the happy path.
- Skipping the commit because "it is not real yet". It is the most real thing
  you will have all day.

## Done when

- A test exists that was seen failing for the right reason and now passes.
- One contract file. One fake, marked, switchable to its failure shape.
- The `slice-green` tag exists.

Then `trial-model-leaf`.
