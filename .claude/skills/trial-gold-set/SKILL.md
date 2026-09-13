---
name: trial-gold-set
description: Build a small hand-labelled evaluation set with stated provenance and lint it with bin/gold-lint.py — the unglamorous hour that produces the one artefact most candidates never bring. Use when you need to measure whether a model's output is actually correct, before tuning a prompt, or when asked how you would evaluate an AI feature.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# The gold set

You cannot improve what you have not measured, and you cannot measure without
labels. Twenty carefully labelled examples beat two thousand scraped ones.
Budget: ninety minutes including the labelling itself.

## Do not build a labelling tool

The most common way this hour is wasted. The labels are the point; the tool is
procrastination in the costume of engineering. Label into a JSONL file in an
editor. If labelling genuinely needs an interface, that is a finding for
`HANDOVER.md`, not a thing to build today.

## Where the examples come from

In order of preference: real data already in the repo or its fixtures; the
brief's own sample material; synthesised examples you write to hit specific
bands. Synthesised is fine **if the provenance says so** — the sin is
presenting synthetic as real, not using it.

## 1. Choose deliberately, not randomly

A random twenty is mostly easy cases and measures nothing. Stratify:

- **Across the output space.** At least two per band, label or class.
- **At the boundaries.** Pairs either side of a threshold. All the disagreement
  lives here; this is where a metric earns its keep.
- **The degenerate ones.** Empty, truncated, off-topic, wrong language.
- **The adversarial one.** Text that tries to instruct the grader. If the model
  obeys it, you have a security finding, not a quality finding.

Tag each row with why it is in: `typical`, `boundary`, `adversarial`,
`degenerate`. The tags become the slices in `trial-agreement`.

## 2. Label before you look at any model output

Non-negotiable. Once you have seen the model's answer your label drifts toward
it. Label the whole set from the source and the criteria alone.

Write the **reason** on every row, one line. It forces the decision and it is
what lets you argue with the model later instead of just disagreeing.

## 3. The format

`evals/gold.jsonl`, one object per line:

```json
{"id":"g01","input_ref":"fixtures/sub-01.txt","criterion":"C","label":4,
 "reason":"identifies origin and purpose but never weighs limitations",
 "tags":["boundary"],"labeller":"me","labelled_at":"2026-09-11"}
```

`input_ref` points at a fixture so the set stays readable and unit tests can
reuse the same files.

## 4. Lint it

```bash
python3 "$CLAUDE_SKILL_DIR/bin/gold-lint.py" evals/gold.jsonl
```

Fails on: missing fields, duplicate ids, missing fixtures, empty reasons, any
label with fewer than two examples, any required tag absent. Warns when the set
looks random or has a single labeller. Copy it into the repo as
`evals/gold-lint.py` and make the check part of the test run.

## 5. State provenance next to every number it produces

In the file header and in the room:

> "Twenty examples I labelled myself in an afternoon. I am not a trained
> examiner, so treat this as a floor and a direction rather than an accuracy
> figure. With a qualified marker the same harness gives a real number."

## 6. Find the human ceiling if you possibly can

A second person labelling even five of the same rows gives you the most useful
number available: how often two humans agree. Save theirs as
`evals/gold-peer.jsonl` in the same shape; `trial-agreement` reads it with
`--ceiling`. A model score without the ceiling looks worse than it is — or
better, which is more dangerous.

## 7. Every human correction is a gold label

Once anything is live, a human overriding a result is the most valuable row in
the system. Append it. This is why results are append-only: an overwrite
destroys a free label at the moment it is created.

## If you finish early

Widen the labelled set. Do not add a feature.

## Done when

- `gold-lint.py` exits 0 on `evals/gold.jsonl`.
- Every row has a reason, a tag and a labeller.
- Provenance is written in the file header.
- No row was labelled after seeing a model output for it.

Then `trial-agreement`.
