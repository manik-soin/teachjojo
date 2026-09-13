import type { SuggestedPractice } from "@/lib/db/schema";
import type { Subject, SyllabusTopic } from "./data";

/**
 * Deep links into RevisionDojo's resource library, matching the URLs the
 * product's own Suggested Practice cards carry (read from its review payload
 * on 13 Sep 2026): `/ib/<subject>/<subject>-<topic>/flashcards|notes|questionbank`,
 * and the topic root for videos. Syllabus topics carry the site's slug
 * verbatim (`slug`), because it is not always derivable: long titles are
 * truncated with a numeric suffix and HL markers are sometimes dropped. For a
 * topic without one the slug is derived the way most of theirs are, from the
 * code and label with dots removed and punctuation collapsed, e.g.
 * "A2.2 Cell structure" -> "a22-cell-structure".
 */
export const RESOURCE_ORIGIN = "https://www.revisiondojo.com";

export type TopicRef = Pick<SyllabusTopic, "code" | "label"> & Partial<Pick<SyllabusTopic, "slug">>;

export function topicSlug(subject: Subject, topic: TopicRef): string {
  if (topic.slug) return topic.slug;
  const stem = `${topic.code} ${topic.label}`
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${subject.slug}-${stem}`;
}

const KIND_PATH: Record<SuggestedPractice["kind"], string> = { Flashcards: "/flashcards", Notes: "/notes", "Question Bank": "/questionbank", Videos: "" };

export function resourceUrl(subject: Subject, topic: TopicRef, kind: SuggestedPractice["kind"]): string {
  return `/ib/${subject.slug}/${topicSlug(subject, topic)}${KIND_PATH[kind]}`;
}
