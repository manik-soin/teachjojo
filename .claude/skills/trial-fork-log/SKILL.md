---
name: trial-fork-log
description: Record an architectural decision as constraint, branch taken, what it costs and what would reverse it, appended to ASSUMPTIONS.md with bin/fork.py. Use when making any non-obvious technical choice, when the user says "I'm not sure whether to", or when a design discussion produces a decision nobody wrote down.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# Fork log

A choice presented without its cost is indistinguishable from a choice made by
accident. This skill makes the difference visible in about ninety seconds.

## The four-part shape

1. **The constraint that forced it.** A fact about the problem, not a
   preference. "A full pass is six model calls, so the tail is tens of seconds."
2. **The branch taken.** What you did.
3. **What it costs.** The part almost everybody skips, and the part that proves
   you have built one of these before.
4. **The reversal condition.** The signal that would make you switch. This
   turns an assertion into a position someone can engage with.

## Write it

```bash
python3 "$CLAUDE_SKILL_DIR/bin/fork.py" \
  --title      "Where the grading work runs" \
  --constraint "A full pass is six model calls; p99 is tens of seconds." \
  --taken      "Queued job with a status row, client polls. Worker in-process today." \
  --costs      "A status model and a pending state in every result screen. ~40 min." \
  --reverses   "A pass reliably under two seconds; then inline and delete the status model."
```

It appends a numbered `### D-0n · title` record under `## Decisions taken` and
refuses to write a record missing any of the four parts — if you cannot name the
cost or the reversal, you have not finished deciding. `--list` prints the
titles; `--check` exits 1 if any existing record is incomplete.

Numbers make decisions referenceable: "that is D-03" and somebody can look it up.

## Which decisions are worth logging

Log if any is true:

- You considered a second option for more than thirty seconds.
- It is expensive to reverse: tenancy, identity, the audit trail, the unit of
  work, the output contract.
- You took a shortcut you would not take with more time.
- "Why did you do it that way" would take a paragraph to answer.

Do not log routine choices with a conventional default. Eight entries get read;
forty do not.

## Naming a branch you did not take

Almost as valuable as taking it, and much cheaper:

> "I would shadow this against the old revision before publishing, but with no
> traffic today I am gating on twenty labels instead."

Put the declined branch in `--costs` or `--reverses` so it is on the record.

## The catalogue

`references/forks.md` lists the recurring junctions in AI-shaped features with
the branch that is usually right early marked. Read it when you suspect you are
at a fork but cannot name it, or when reviewing a design for decisions somebody
made without noticing. Do not read it otherwise; it is a checklist, not a
tutorial.

## Done when

The record exists in `ASSUMPTIONS.md`, `fork.py --check` passes, and the cost
line names a real price (time, a state to maintain, a capability given up), not
"slightly more complex".

`trial-handover` reads these back and checks the code against them.
