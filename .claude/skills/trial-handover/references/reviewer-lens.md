# What "architecture approach" reviewers actually score

A self-check to run against the diff and the handover note before submitting.
Score each 0 / 1 / 2. Anything at 0 is a sentence to add to HANDOVER.md tonight,
not a feature to build.

## Boundaries
- [ ] The probabilistic part is a leaf. Orchestration, validation and persistence
      are deterministic and have tests that run offline.
- [ ] There is one typed contract at the seam, in one file, and everything agrees
      with it.
- [ ] Untrusted text (user input) cannot acquire authority: the model's output is
      typed, proposes rather than acts, and has no tools or write access.

## Identity and state
- [ ] Anything cached is keyed on the whole input tuple, and the invariant is
      stated somewhere ("the key contains everything that can change the answer").
- [ ] Results are append-only or the reviewer can see why not.
- [ ] Every result names what produced it (model id, prompt version, rubric rev).

## Failure
- [ ] Each failure mode has a decided behaviour (closed / open) and it is written
      down, not discovered in an exception handler.
- [ ] Retries are bounded. Repair is bounded. There is a per-run ceiling.
- [ ] The demo includes one deliberate failure and the system is honest about it.

## Measurement
- [ ] There is a labelled set with stated provenance, however small.
- [ ] There is one number with an interval, and the slices are visible.
- [ ] Something fails (a test, a make target, a CI step) if the number drops.

## Judgement
- [ ] Decisions are recorded with their cost and reversal condition, not just
      their conclusion.
- [ ] "Deliberately not built" is a list of choices, not an apology.
- [ ] Scope was cut before measurement was cut.
- [ ] The README command works from a clean checkout.

## Signals that read as junior, to remove
- A second feature at 60% instead of a first at 100%.
- Confidence scores from the model treated as probabilities.
- A prompt string as the cache key.
- `catch (e) { retry() }` with no cap.
- "Ran out of time" without a corresponding "so I cut X because Y".
- A labelling UI.
