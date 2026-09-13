---
name: trial-seam-map
description: Read-only reconnaissance of an unfamiliar codebase that returns the domain model and the single place a change should go, in under 500 words. Use when starting work in a repo you did not write, when asked to "find where X happens", or before planning any change to unfamiliar code. Best run as a subagent so the files read never enter the main context.
allowed-tools: [Read, Glob, Grep, Bash]
---

# Seam map

Investigation that returns a conclusion, not a file dump. The value is **context
hygiene**: forty files are read, four hundred words come back, the forty files
never enter the caller's window.

## How the caller should invoke this

As a subagent, with the deliverable sentence as the question:

> Use the trial-seam-map skill. The change I need to make is: <deliverable
> sentence>. Return the five-section output only.

If the caller runs this inline instead, the forty files land in their context
and the point is lost.

## Rules

- **Read only.** Never edit, never propose a fix, never write a file. A bug
  spotted gets one line and no more.
- **Bounded.** Stop at roughly forty files or fifteen minutes. If the seam is
  not found by then, say what to look at next and return anyway.
- **Under 500 words out.** Longer means evidence was returned instead of a
  conclusion. Cite `file.ts:120`; never paste the block.
- **Monorepos.** Find the one package the change lives in first (from the
  route or the type), then apply the reading order inside it only.

## Order of reading

Never start with components. They teach the least per file.

1. **Entry points.** Routes, handlers, CLI commands, queue consumers. This is
   the product's actual API and gives the domain nouns in ten minutes.
2. **Types and schema.** Migrations, model definitions, shared types. The
   schema is the truth; the code is an opinion about the schema.
3. **Write paths.** Where state changes and what validates before it does.
   Almost every interesting constraint lives here.
4. **Config and env.** What is pinned, flagged, secret. Note the model id and
   any prompt files: are they code or data?
5. **Tests.** Test names are free documentation of intent. Also note the test
   runner and whether the suite runs offline — `trial-slice` needs to know.

## Output shape

Exactly these five sections.

```
DOMAIN MODEL
  4-6 nouns and how they relate. One line each.

ENTRY POINTS
  path:line — method, request type in, response type out

WRITE PATHS
  What mutates, what validates first, what is transactional

THE SEAM
  The single place this change goes, file and line, and the existing
  type or function it should extend. If there are two candidates, name
  both and what distinguishes them — a fork for the caller to record,
  not for you to resolve.
  Also: test runner + command, and whether it runs without network.

WHAT I DID NOT LOOK AT
  So the caller knows the shape of the gap.
```

## Scoping the question

A vague investigation reads hundreds of files and returns mush. Narrow it and
say you did:

- "Investigate the auth system" → "Find the three files that decide whether a
  request is authenticated."
- "How does grading work" → "Find where a submission becomes a result, and
  what validates that result before it is persisted."

## Done when

The five sections are written, THE SEAM names one file and line (or two with a
distinguishing fact), and the total is under 500 words. Return. Do not keep
reading to be sure.
