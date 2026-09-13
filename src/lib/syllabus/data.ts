/**
 * The IB syllabus the picker offers: four subjects, every unit and topic of the
 * current guides, with hand-written learning objectives, a rubric of required
 * ideas per objective and known misconceptions. In the real product this comes
 * from Sanity (Portable Text) keyed by topic; here it is typed constants (one
 * file per subject under `subjects/`) so the picker and objectives are
 * deterministic and a session never needs a model call for syllabus topics.
 * Topic codes, labels and resource-library slugs were read from RevisionDojo's
 * subject pages on 13 Sep 2026.
 */
import { BIOLOGY } from "./subjects/biology";
import { CHEMISTRY } from "./subjects/chemistry";
import { ECONOMICS } from "./subjects/economics";
import { PHYSICS } from "./subjects/physics";
import type { Subject, SyllabusTopic, SyllabusUnit } from "./types";

export type { Subject, SyllabusTopic, SyllabusUnit } from "./types";

export const SUBJECTS: Subject[] = [BIOLOGY, CHEMISTRY, ECONOMICS, PHYSICS];

export const MAX_TOPICS = 5;

/**
 * Topic ids that shipped and were later renamed. Ids are stored on sessions, so
 * old sessions keep resolving to their rubric and misconceptions.
 */
const LEGACY_TOPIC_IDS: Record<string, string> = {
  // Shipped as "2.2 Demand"; the IB guide and RevisionDojo number Demand 2.1 (Supply is 2.2).
  "u2-2-demand": "u2-1-demand",
};

/** The syllabus as the browser may see it: no rubric criteria and no misconception priors, which together are the answer key. */
export function toPublicSubjects(subjects: Subject[]): Subject[] {
  return subjects.map((s) => ({
    ...s,
    units: s.units.map((u) => ({ ...u, topics: u.topics.map(({ criteria: _c, misconceptions: _m, ...t }) => (void _c, void _m, t)) })),
  }));
}

export function findSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function findTopic(subject: Subject, topicId: string): { unit: SyllabusUnit; topic: SyllabusTopic } | undefined {
  const id = LEGACY_TOPIC_IDS[topicId] ?? topicId;
  for (const unit of subject.units) {
    const topic = unit.topics.find((t) => t.id === id);
    if (topic) return { unit, topic };
  }
  return undefined;
}
