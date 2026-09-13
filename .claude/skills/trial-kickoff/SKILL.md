---
name: trial-kickoff
description: Run the first thirty minutes of a timed work trial or take-home — convert an underspecified brief into an agreed one-sentence deliverable, create the assumptions log with bin/init.sh, and pick the seam before opening an editor. Use at the start of a trial, interview exercise, or any task where the requirements are deliberately thin.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion]
---

# Trial kickoff

The first thirty minutes decide how the rest is judged. Do not open an editor.

## 1. Write the deliverable as one sentence

> By the end I will have **[one narrow thing]** working end to end, with
> **[a number]** measured on **[n examples]**, and **[one screen or output]**
> that shows it.

Every bracket must be filled. "Grading" is not a narrow thing; "criterion C of
the IB history rubric, one band per submission" is. If the brief offers several
features, pick the one that exercises the model *and* a persisted result *and*
a screen — the full vertical — and name the others as deliberately not built.

Then tell the user to say the sentence out loud to whoever set the brief. It
converts an underspecified brief into an agreed contract, and if they picked the
wrong thing they find out at minute two instead of hour four.

## 2. Questions: one round, three maximum

Ask only what blocks the sentence. Good questions change the shape of the work:

- "Is there existing rubric data I should use, or do I bring my own?"
- "Does this need to run inside the request or can it be async?"
- "Who is the user of the screen — a teacher or a student?"

Bad questions have a conventional default. Do not ask them; assume, and log the
assumption. Use AskUserQuestion for the good ones, once.

## 3. Create the assumptions log

```bash
bash "$CLAUDE_SKILL_DIR/bin/init.sh" "<the sentence>" <hours>
```

It writes `ASSUMPTIONS.md` with the sentence, start time, the moment to stop
building (one hour before hand-off) and empty tables for assumptions, decisions
and deliberate cuts. It refuses to overwrite.

Every time you guess, add a row to the assumptions table immediately. Do not
batch this; you will not remember.

## 4. Read the API surface, not the code

Invoke `trial-seam-map` **as a subagent** so the files it reads never enter this
context. Pass it the deliverable sentence as the question. You want routes,
types and schema. Components last; they are the most replaceable part of any
codebase.

## 5. Name the seam and write it down

Fill in the `**Seam:**` line in `ASSUMPTIONS.md` with a file and line. If the
seam map returned two candidates, that is your first fork — record it with
`trial-fork-log` before choosing.

## 6. Hand off to the slice

Go straight to `trial-slice`. Not the interesting middle.

## The line to say when stuck for fifteen minutes

> "I have spent fifteen minutes on <X> and it is not the interesting part of this
> task, so I am going to hardcode <Y> and come back if there is time."

Nobody has ever been marked down for that. Silent flailing loses trials.

## Done when

- `ASSUMPTIONS.md` exists with a sentence in which every bracket is filled.
- The sentence has been said to the brief-setter, or the user has declined to.
- The seam line names a file. 
- No implementation file has been edited yet.

Target: under thirty minutes. If it is past forty, stop and go to `trial-slice`
with whatever seam you have.
