---
name: trial-adversary
description: Role-swapped review of the current diff — act as the reviewer scoring "architecture approach", list what is junior and what would be marked down, fix nothing. Use once an hour during a trial, before any commit you would be embarrassed by, or when the user asks "is this good" — the answer to that question is never yes from the agent that wrote it.
allowed-tools: [Read, Bash, Glob, Grep]
---

# Adversary

The agent that wrote the code cannot review it. Sycophancy and self-preference
are both measured effects; a same-context "is this good" returns yes. This skill
changes the chair, and ideally the context.

## Run it in a fresh context

Best as a subagent, so the reviewer has not spent three hours reading the
author's justifications:

> Use trial-adversary on the diff since `slice-green`. Return the list only.

If it must run inline, say so in the output; the finding quality is lower.

## Rules

- **Read only. Fix nothing.** A review that fixes is defending its fix.
- **List, do not narrate.** One line per finding: file:line, what, why it
  reads as junior.
- **Score against a rubric, not a vibe.** Use
  `../trial-handover/references/reviewer-lens.md` if present; otherwise the
  short list below.
- **Under 300 words.** Findings, not an essay.

## What to look for, in order of how often it is there

1. The model deciding flow: choosing tools, next steps, or whether to act.
2. A retry, repair or fan-out with no cap.
3. A cache key that is the prompt string, or missing a tuple member.
4. A floating model alias.
5. Output acted on before validation; validation without a domain invariant.
6. Results overwritten in place.
7. A failure path that lies: an output type that cannot say "could not".
8. Untrusted text given authority: model output that can write, call, or route.
9. Assumptions in code that are not in `ASSUMPTIONS.md`; decisions in
   `ASSUMPTIONS.md` that the code contradicts.
10. A second feature at 60% while the first is at 80%.
11. Stray debug output, secrets, tracked `.env`, TODO with no owner.
12. Tests that need the network.

## Output shape

```
JUNIOR SIGNALS (would be marked down)
  path:line — finding — why

CONTRADICTIONS (code vs ASSUMPTIONS.md)
  D-0n / A-0n — what the code does instead

UNLOGGED DECISIONS (non-obvious, not written down)
  path:line — the choice that was made

CLEAN
  what is genuinely fine, in one line, so the author knows what not to touch
```

## Done when

The four sections are returned and nothing was edited. The caller decides what
to fix; anything they choose not to fix becomes a "Deliberately not built" row.
