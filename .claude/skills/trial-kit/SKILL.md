---
name: trial-kit
description: Index of the work-trial skill set — what each skill does, the order they compose in, and a "where should I be right now" diagnostic. Use when starting a timed work trial or take-home, when unsure which trial-* skill applies, when behind schedule, or when the user asks "what skills do I have for this".
allowed-tools: [Read, Glob, Bash]
---

# Trial kit

Eleven skills for a timed engineering trial on an AI-shaped feature. Each does one
job, each names its neighbours, and any one is usable alone. Five ship a tool.

## The sequence, as fractions of the time box T

| Window | Skill | Produces | Tool |
|---|---|---|---|
| 0 – 2% | `trial-kickoff` | One-sentence deliverable agreed out loud; `ASSUMPTIONS.md` | `bin/init.sh` |
| 2 – 5% | `trial-seam-map` | Domain model and the one place the change goes. **Run as a subagent** | |
| 5 – 10% | `trial-slice` | End to end with a fake middle, test fails for the right reason, `slice-green` tag | |
| 10 – 35% | `trial-model-leaf` | The real inference call: typed contract, one repair, tuple key, envelope | `references/leaf-sketch.md` |
| 35 – 65% | `trial-gold-set` | Twenty stratified hand labels with provenance, linted | `bin/gold-lint.py` |
| 65 – 80% | `trial-agreement` | One number with an interval, slices, regressions, a gate | `bin/score.py` |
| hourly | `trial-adversary` | Role-swapped review of the diff: junior signals, contradictions, unlogged decisions. **Fresh context** | |
| on any error | `trial-diagnose` | Reproduce, one-sentence cause shown before editing, smallest fix, regression test | |
| any time | `trial-fork-log` | A decision as constraint / branch / cost / reversal, numbered | `bin/fork.py`, `references/forks.md` |
| last 20% | `trial-handover` | Preflight, `HANDOVER.md`, reviewer self-check, demo script | `bin/preflight.sh`, `references/reviewer-lens.md` |

For a six-hour trial: kickoff by 0:10, slice green by 0:40, real model call by
2:00, labels done by 4:00, number by 4:45, stop building at 5:00.

## Where should I be right now

Read the time box and start time from `ASSUMPTIONS.md`, compute the fraction
elapsed, and check the artefact for that window exists. If it does not, the
next skill is the one whose artefact is missing — not the one after it.

| Elapsed | Must exist | If missing |
|---|---|---|
| 5% | `ASSUMPTIONS.md` with a deliverable sentence | `trial-kickoff`, now, five minutes |
| 15% | `git tag slice-green` | `trial-slice`. Do not touch the model until this exists |
| 40% | A real model call behind the same contract; tests pass offline | `trial-model-leaf`, but cap it: fake middle is an acceptable ship |
| 65% | `evals/gold.jsonl` passing `gold-lint.py` | `trial-gold-set` with ten rows, not twenty. Say you shrank it |
| 80% | A number with an interval, printed by a command in the repo | `trial-agreement`, thirty minutes maximum |
| 85% | Building has stopped | `trial-handover`. Nothing else |

## The two rules the kit enforces

1. **A narrow finished thing beats a broad nearly-working one.** Every skill
   pushes scope down and measurement up. Between a seventh feature and a wider
   labelled set, the labelled set wins.
2. **A choice without its cost is indistinguishable from an accident.** Every
   fork gets its constraint, branch, price and reversal condition, written down.

## If you only use two

`trial-slice` early and `trial-agreement` late. The first guarantees something
to show; the second produces the artefact almost nobody else brings.

## Installing into the trial repo

```bash
mkdir -p <repo>/.claude/skills && cp -R ~/.claude/skills/trial-* <repo>/.claude/skills/
```

Commit them. Project skills win over personal ones of the same name, and the
reviewer seeing how you drive your tools is part of what is assessed.
