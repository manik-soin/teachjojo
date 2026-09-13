---
name: trial-handover
description: Close out a timed trial or take-home — run bin/preflight.sh, audit the diff against the stated assumptions, score yourself against the reviewer lens, write the handover note, and rehearse a two-minute demo. Use in the last hour of a trial, before submitting a take-home, or when asked to summarise what was built and what was left.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# Handover

The last hour is worth more than any other, because it is the only one whose
output the reviewer definitely reads. Stop building with sixty minutes left.
`ASSUMPTIONS.md` has the time.

## 1. Audit the code against the assumptions (15 min)

Run as a subagent, before writing anything:

> Read `ASSUMPTIONS.md` and the full diff since `slice-green`. Where does the
> code contradict a stated assumption or decision, and where did I do something
> non-obvious that is not written down? List discrepancies only. Do not fix
> anything.

For each discrepancy: fix it if it is minutes, or add it to the assumptions
file as a known gap. Either is fine. Silently shipping a contradiction is not.

## 2. Preflight (5 min)

```bash
bash "$CLAUDE_SKILL_DIR/bin/preflight.sh" "npm test"    # your test command
```

Clean tree, required files, stray debug output, secrets, tracked `.env`,
unexplained TODO/FAKE markers, decision records complete, handover sections
present, tests green. Fix every FAIL. Each WARN is either fixed or named in
"Deliberately not built".

## 3. Score yourself against the reviewer lens (10 min)

Read `references/reviewer-lens.md` and mark each item 0 / 1 / 2 against the
diff. Every 0 becomes a sentence in `HANDOVER.md` tonight — under "Deliberately
not built" or "What I would do next" — not a feature to build. The list of
junior signals at the bottom is a grep list: remove what you find.

## 4. Write the handover note (15 min)

`HANDOVER.md` at the root, these sections, this order. Short. They want your
judgement, not your writing.

```markdown
# <one sentence: what this does>

## Run it
<three commands, each verified by actually running it from a clean checkout>

## What works
Bullets. What is genuinely end to end; what the tests cover; what runs offline.

## The number
Exact, interval, n, coverage, who labelled, the ceiling if known.
A floor with a caveat beats a bare figure.

## Assumptions
From ASSUMPTIONS.md: the ones that would change the design if wrong.

## Decisions
D-01 … with constraint, cost and reversal. Copy, do not summarise.

## Deliberately not built
Each item: the thing, and why the cut was right. This section reads as
seniority. It converts everything missing from an apology into a decision.

## What I would do next
Three things, ordered, with why each is first.
```

## 5. Rehearse the two-minute demo (10 min)

A numbered list, run once end to end before presenting. One narrow thing
working, in the order a reviewer wants:

1. The input going in.
2. The thing happening — including one deliberate failure case, so they see
   the system being honest rather than only the happy path.
3. The output, and the screen if there is one.
4. The number, and the command that prints it.
5. Break something on purpose and show the gate go red. Most candidates never
   reach this moment and it lands harder than any feature.

## 6. The closing sentence

> "One <thing> graded end to end, measured at <number> on <n> examples I
> labelled myself, wired as a check that fails. I deliberately did not build
> <X> or <Y> because a second <thing> would have taught me nothing new, and I
> would rather hand you one number I trust than three features I cannot vouch
> for."

## If you are behind

Cut scope, not measurement. Dropping the labels to keep a feature is the worst
trade available: the number is the argument that you engineer around a
probabilistic component rather than hoping. Shrink the gold set to ten before
you drop it to zero, and say that you shrank it.

## Done when

- `preflight.sh` exits 0.
- `HANDOVER.md` has all seven sections and every "Run it" command was pasted
  and worked.
- The demo was run once, start to finish, including the red gate.
- Nothing has been built in the last hour.
