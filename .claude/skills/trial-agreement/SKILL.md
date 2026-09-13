---
name: trial-agreement
description: Turn a hand-labelled gold set into one honest number with a confidence interval, a per-slice breakdown, coverage, a human-ceiling comparison and a per-item regression list, then wire it as a check that fails. Use after labelling examples, before and after any prompt or model change, or when asked "how do you know it works".
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# Agreement

One honest number beats six unlabelled charts. This skill produces it and then
makes it a gate, because an eval you do not gate on is a dashboard. Budget:
forty-five minutes, most of it generating predictions.

## 1. Generate predictions

Run the real leaf over every `input_ref` in the gold set and write
`evals/pred.jsonl`: `{"id": ..., "pred": ...}`. Where the leaf failed closed,
write `"pred": null` — an abstention is an answer and must be counted.

Cache hits are fine. Do not hand-edit predictions.

## 2. Score

```bash
python3 "$CLAUDE_SKILL_DIR/bin/score.py" \
  --gold evals/gold.jsonl --pred evals/pred.jsonl \
  --ceiling evals/gold-peer.jsonl        # if a second labeller exists
```

Standard library only. It reports:

- **exact** and **within-K** agreement (`--within`, default 1), each with a
  bootstrap 95% interval
- **quadratic weighted kappa** and **mean signed error** for ordinal labels
- **coverage** — the share the model answered rather than abstained on
- **human ceiling** — how often the two labellers agreed on shared rows, and the
  model's gap to it
- **by slice** — accuracy per tag, so boundary and adversarial cases are visible
- **every wrong item** with the gold reason beside it
- with `--baseline prev.jsonl`: **which items got worse**, including items the
  model now abstains on that it used to get right

Copy it into the repo as `evals/score.py`. It is part of the deliverable.

## 3. Choose which number to lead with, and say why

- **Exact** — honest and harsh. Always report it first.
- **Within one** — for bands and scores, where one off is a different kind of
  wrong from three off. Alongside exact, never instead.
- **Quadratic kappa** — chance-corrected; the standard in assessment. Quote it
  if the audience knows the literature.
- **Mean signed error** — answers "does it mark high or low", the first thing
  anyone asks.

Accuracy on an imbalanced set misleads; a model that always guesses the middle
band scores respectably and is useless. That is what the slices are for.

## 4. Always quote the range and the ceiling

> "Exact agreement 59%, within one band 100%, on seventeen answered of twenty.
> The interval on exact is 35 to 82 because twenty is a small sample. Two
> humans agreed 75% on the eight rows we both labelled, so the model is sixteen
> points under the ceiling, not forty under perfect."

That sentence is more credible than any bare number and answers the obvious
challenge before it is raised.

## 5. Per-item regressions, every time you change anything

```bash
python3 evals/score.py --gold evals/gold.jsonl --pred new.jsonl \
  --baseline prev.jsonl --max-regressions 0
```

> "Agreement went from 71 to 74 percent, and here are the four cases that got
> worse."

Only someone who has shipped a model change says that sentence.

## 6. Wire it as a gate

```bash
python3 evals/score.py --gold evals/gold.jsonl --pred evals/pred.jsonl \
  --min-within 0.85 --min-coverage 0.9 --max-regressions 0
```

Add it to the test command or a make target. Then say what it protects: a
prompt change, a rubric revision and a model version bump are all behaviour
changes and all pass the same gate.

For the demo, break something on purpose — change the prompt version, drop a
rubric line — regenerate, and show the gate go red.

## Done when

- `evals/score.py` and both JSONL files are committed.
- One sentence in `HANDOVER.md` quotes exact, the interval, n, coverage,
  provenance, and the ceiling if known.
- A command in the repo exits non-zero when the number drops.
