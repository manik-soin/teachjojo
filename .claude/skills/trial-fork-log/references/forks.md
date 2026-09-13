# The recurring forks in an AI-shaped feature

A checklist for naming a junction you are standing at. Not prescriptions — each
one has a defensible answer in both directions. The `←` marks the branch that is
usually right early, which is not the same as always right.

## Placement
**Where does the expensive work run?** Inline in the request · ← queued job with
a status row · queued with streamed partials.
*Forced by* the p99 of the whole pass, not the p50 of one call.
*Cost of queueing* a status model and a pending state in every screen.

**What does the client call?** Request/response · ← resource + status endpoint ·
persistent stream. Making the run addressable is what later makes evals,
debugging, cost attribution and "show me what the model saw" possible.

## Unit of work
**How much does one call do?** Whole job · ← one bounded sub-unit · per span.
*Pick by asking* what you would want to re-run in isolation when it comes out
wrong. That question answers caching, retries, partial rendering and the eval
schema at once.

**How do many calls run?** Sequential · ← bounded parallel · staged cheap-then-
expensive. Decide the partial-failure policy before writing the fan-out, not in
the exception handler at hour five.

## Identity
**What is in the cache key?** Prompt string hash · ← the whole input tuple
(content hash, rubric revision, prompt version, model id, decoding params, schema
version) · client-supplied idempotency key. The invariant: *the key contains
everything that can change the answer.*

**What happens to old results on a version change?** ← Nothing, new key new row ·
eager backfill · lazy on read. With a proper tuple, invalidation is not a
mechanism you build — nothing is ever overwritten.

## State
**Store the output, or the whole call?** Output only · ← full envelope (inputs by
reference, versions, raw and parsed output, cost, latency, validation path) ·
sampled envelope. The envelope is your eval corpus written down early.

**Update or supersede?** Update in place · ← append, project latest · full event
sourcing. Append-only is how a human correction becomes a free gold label instead
of a destroyed one.

## Wrongness
**What tells you an answer is suspect?** Self-reported confidence · structural
validation (always, it is the floor) · ← agreement across samples · independent
verifier. These measure validity, stability and human agreement — only the last
is quality.

**What happens when it fires?** Retry (form failures only, cap at one) ·
escalate to a stronger tier · degrade honestly · ← defer to a human.
Fail closed for anything decision-shaped; fail open for conversation.

## Money
**Where does the budget live?** Provider cap (a fuse, not a control) · ← per-run
ceiling on calls, tokens and wall time · per-tenant quota.

**Can you say what one unit costs?** Monthly invoice · ← cost on the envelope ·
modelled estimate. Two columns, and it gives you cost per submission on day one.

## Trust
**How do you treat user-written text?** Trust it · detect and block (a layer,
never the boundary) · ← constrain the output so a successful injection is
worthless. You cannot fix injection at the input; fix it at the authority.

**What may the output do alone?** ← Propose only · act within a whitelist ·
general agency. Capability is not authority: a strong model with no write access
is safer than a weak one holding a connection.

## Surface
**What does the user see while waiting?** Spinner · token streaming (commits you
to prose, and opts you out of validating before display) · ← structural progress
per sub-unit. Decided by the unit-of-work fork, not independently.

**How much doubt is admitted?** Hide it · numeric confidence (a promise about
calibration) · ← evidence first, verdict second. Only possible if the output
contract carries verifiable spans — the interface decision and the schema
decision are the same decision.

**When does the screen change after an action?** Wait for confirmation ·
optimistic update (assumes you know the answer in advance, which a model output
never is) · ← pending as a designed first-class state.

## Change
**Is a prompt code or data?** Literals in source · ← versioned records, published
revisions immutable, every result naming what produced it · fully dynamic.

**How does a change reach users?** Ship it · ← gate on the labelled set, reading
per-item regressions not just the aggregate · shadow then canary.

## Scale and tenancy
**Where does one customer's data end?** ← Column on every row with enforced
scoping · schema per tenant · database per tenant. Close to irreversible — this
is the class of decision where "properly later" is usually false.

## Vendor
**Which model version does production call?** Floating alias · ← pinned, recorded
on every call · pinned with a staged eval-gated upgrade. A vendor upgrade is a
behaviour change and belongs in the same pipeline as a prompt change.
