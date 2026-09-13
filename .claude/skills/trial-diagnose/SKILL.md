---
name: trial-diagnose
description: Handle a bug or failing check under time pressure — reproduce, diagnose in one sentence, propose the smallest fix, add the regression test, stop. Use whenever an error is pasted, a test goes red unexpectedly, or the user says "fix this"; never fix before the cause is named.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# Diagnose

Paste-and-pray fixes the symptom the agent can see; the cause waits for the
demo. This skill puts a named cause between the error and the edit. Budget:
fifteen minutes, then the fifteen-minute line.

## 1. Reproduce, or say you cannot

Run the failing thing. Quote the actual error, not a paraphrase. If it cannot be
reproduced in two attempts, say so and stop: an unreproducible bug is a fork
(work around it, or log it and move on), not a fix.

## 2. Diagnose in one sentence

> The failure is <symptom> because <cause>, at <file:line>.

Then **stop and show the sentence** before editing. If the sentence contains
"probably" or "might", you have a hypothesis, not a diagnosis. Say which
observation would confirm it, make that observation, then rewrite the sentence.

## 3. Smallest fix

The minimum change that addresses the cause. Not the adjacent cleanup, not the
refactor it suggests. If the fix touches more than two files, that is a signal
the diagnosis is wrong or the fix is a design change; say which.

## 4. Regression test

The bug becomes a test that fails on the old code and passes on the new. If the
existing suite already covers it and was not running, that is the finding.

## 5. Classify

- **Symptom of a logged decision** — note it under that `D-0n`.
- **Symptom of an unlogged assumption** — add the assumption row now.
- **Plain bug** — fix, test, commit, move on.

## The fifteen-minute line

If the cause is not named in fifteen minutes:

> "I have spent fifteen minutes on <X> and it is not the interesting part, so I
> am going to <hardcode / work around / disable> <Y> and log it."

Then do that and record it as a deliberate cut.

## Done when

The one-sentence diagnosis was shown before any edit; the fix is minimal; a
test now guards it; the change is committed on green.
