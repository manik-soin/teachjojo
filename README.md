<div align="center">
  <img src="public/jojo/jojo-and-baby-jojo.svg" alt="Jojo and Baby Jojo" width="180" />
  <h1>Teach Jojo</h1>
  <p>Learn by explaining. Teach Baby Jojo, uncover gaps, and review your progress.</p>
  <p><strong>Next.js 16 · React 19 · TypeScript · AI SDK · PostgreSQL</strong></p>
  <p><a href="#development">Development</a> · <a href="#architecture">Architecture</a> · <a href="#validation">Validation</a></p>
</div>

---

A chat-based recreation of RevisionDojo's Teach Jojo experience. Students select IB syllabus topics or supply their own material, explain concepts to Baby Jojo, and receive an evidence-based session review. Sessions, objectives, tutor help, and assessment evidence are persisted per anonymous user.

## The Experience

| Choose | Teach | Review |
| :--- | :--- | :--- |
| Select a subject, topics, difficulty, and session length. | Explain concepts through streamed conversation, with optional tutor help. | Revisit the transcript, assessment annotations, strengths, and suggested practice. |

Biology, Chemistry, Physics, and Economics syllabuses are included. Voice, billing, and production identity integration are outside this implementation's scope.

## Development

Use Node.js 22 and the pnpm version declared in `package.json`.

```bash
pnpm install --frozen-lockfile
```

Configure `.env.local` with your PostgreSQL connection and a random cookie-signing secret:

```dotenv
DATABASE_URL=postgres://user:password@localhost:5432/teachjojo
RD_UID_SECRET=replace-with-a-long-random-secret
JOJO_MODEL=mock
```

```bash
pnpm db:migrate
pnpm dev
```

Open [localhost:3000](http://localhost:3000). The mock model exercises the product without model credentials; PostgreSQL is still required. For a real model, configure its provider credentials and `JOJO_MODEL`; routing is defined in [`model.ts`](src/lib/jojo/model.ts). Keep credentials and local environment files out of Git.

## Architecture

```mermaid
flowchart LR
    UI[Session UI] --> API[Actions and streaming routes]
    API --> Service[Session service]
    Service --> Rules[Objective and turn rules]
    Service --> Model[Typed model calls]
    Service --> Repo[Repository]
    Repo --> DB[(PostgreSQL)]
    Eval[Evaluation harness] --> Model
```

| Boundary | Responsibility | Source |
| :--- | :--- | :--- |
| Interface | Setup, streamed replies, help, and reviews | [`src/components/teach-jojo`](src/components/teach-jojo) |
| Transport | Server actions and streaming endpoints | [`src/app`](src/app) |
| Orchestration | Ownership, turn claims, retries, and persistence | [`src/lib/sessions`](src/lib/sessions) |
| Model calls | Prompts, validated contracts, repair, and routing | [`src/lib/jojo`](src/lib/jojo) |
| Curriculum | Objectives, rubrics, and resource links | [`src/lib/syllabus`](src/lib/syllabus) |
| Storage | Schema and versioned migrations | [`src/lib/db`](src/lib/db) · [`drizzle`](drizzle) |

**Models propose; code decides.** Output is validated before persistence. Objective completion is gated by rubric coverage, grounded student evidence, and the say-it-back assessment. Deterministic rules handle stalls, hint repetition, and turn planning.

**Streaming and persistence have separate boundaries.** Partial events update the conversation during generation. A final event follows validation and commit. Request IDs and turn claims support retries and concurrent sends.

**Assessment remains inspectable.** Stored messages, tags, objective transitions, and model-call metadata support review and evaluation. Anonymous signed cookies provide session ownership; full identity integration remains future work.

## Validation

```bash
pnpm check                  # TypeScript, ESLint, and unit/service tests
JOJO_MODEL=mock pnpm eval    # Deterministic evaluation gate
pnpm build                  # Production build
```

The evaluation harness measures objective-status agreement, false completions, tag precision and recall, grounding, register, latency, and token usage. The small gold set is a regression tool, not a claim of general model quality. Generated results remain local.

CI runs these checks and verifies migration consistency. Paid-model evaluation runs only through the manual workflow and requires repository credentials.

## Database Changes

Edit [`schema.ts`](src/lib/db/schema.ts), then generate and review the migration:

```bash
pnpm db:generate --name describe_change
```

Commit the SQL **and** `drizzle/meta` snapshots and journal together. Apply migrations with `pnpm db:migrate`; use `db:push` only for disposable development databases.

## Engineering Notes

- [Model contracts](src/lib/jojo/contract.ts)
- [Session orchestration](src/lib/sessions/service.ts)
- [Evaluation harness](eval/run.mts)

History is organized by subsystem using Conventional Commit messages. The initial subsystem commits are a curated snapshot of the implementation, not a record of its original development chronology.
