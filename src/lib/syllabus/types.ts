/**
 * Shape of the syllabus the picker, the session service and the grader share.
 * In the real product this content comes from Sanity (Portable Text) keyed by
 * topic; here it is typed constants (one file per subject under `subjects/`)
 * so the picker and objectives are deterministic and a session never needs a
 * model call when syllabus topics are chosen.
 */

export type SyllabusTopic = {
  /** Stable opaque id; stored on sessions, so it never changes once shipped. */
  id: string;
  /** Syllabus code as the IB guide and RevisionDojo print it, e.g. "A2.2", "2.5", "S1.3", "B.1". */
  code: string;
  label: string;
  /**
   * RevisionDojo's resource-library slug for this topic (`/ib/<subject slug>/<slug>/...`), read from
   * the subject pages on 13 Sep 2026. Stored explicitly because the site's slugs are not derivable
   * from the title: long titles are truncated with a numeric suffix, HL markers are sometimes dropped.
   */
  slug: string;
  objectives: string[];
  /**
   * Required ideas per objective, keyed by the objective text: what a student must have said, in
   * any words, before Baby Jojo may count the objective as complete. The grader reports which are
   * covered; code refuses completion until all are listed. Absent for custom material.
   */
  criteria?: Record<string, string[]>;
  /** Well-known student misconceptions for this topic. Priors for the grader; Jojo never recites them. */
  misconceptions?: string[];
};

export type SyllabusUnit = { id: string; label: string; topics: SyllabusTopic[] };

export type Subject = {
  id: string;
  name: string;
  short: string;
  /** RevisionDojo's resource-library slug for the subject (`/ib/<slug>/...`), verified against the live site on 13 Sep 2026. */
  slug: string;
  tint: "fuchsia" | "purple" | "primary" | "success" | "warning";
  units: SyllabusUnit[];
};
