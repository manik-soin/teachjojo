import { describe, expect, it } from "vitest";
import { MAX_TOPICS, SUBJECTS, findSubject, findTopic, toPublicSubjects } from "./data";

const topics = SUBJECTS.flatMap((s) => s.units.flatMap((u) => u.topics.map((t) => ({ subject: s, unit: u, topic: t }))));

describe("syllabus data", () => {
  it("offers every subject far more topics than a session may pick", () => {
    for (const s of SUBJECTS) {
      const count = s.units.reduce((n, u) => n + u.topics.length, 0);
      expect(count, `${s.name} has ${count} topics; the picker says "Choose up to ${MAX_TOPICS}"`).toBeGreaterThanOrEqual(MAX_TOPICS * 3);
    }
  });

  it("uses ids, codes and slugs that are unique within their scope", () => {
    const ids = topics.map((t) => t.topic.id);
    expect(new Set(ids).size).toBe(ids.length);
    const slugs = topics.map((t) => t.topic.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of SUBJECTS) {
      const codes = s.units.flatMap((u) => u.topics.map((t) => t.code));
      expect(new Set(codes).size, `${s.name} codes`).toBe(codes.length);
      for (const t of s.units.flatMap((u) => u.topics)) expect(t.slug.startsWith(`${s.slug}-`), `${t.slug} under ${s.slug}`).toBe(true);
    }
  });

  it("gives every objective a rubric of two to four required ideas and every topic at least three misconceptions", () => {
    for (const { subject, topic } of topics) {
      const where = `${subject.short} ${topic.code} ${topic.label}`;
      expect(topic.objectives.length, where).toBeGreaterThanOrEqual(2);
      expect(topic.objectives.length, where).toBeLessThanOrEqual(3);
      expect(Object.keys(topic.criteria ?? {}).sort(), where).toEqual([...topic.objectives].sort());
      for (const [objective, ideas] of Object.entries(topic.criteria ?? {})) {
        expect(ideas.length, `${where}: ${objective}`).toBeGreaterThanOrEqual(2);
        expect(ideas.length, `${where}: ${objective}`).toBeLessThanOrEqual(4);
        expect(new Set(ideas).size, `${where}: ${objective}`).toBe(ideas.length);
      }
      expect(topic.misconceptions?.length ?? 0, where).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps the rubric and misconceptions off the client", () => {
    for (const s of toPublicSubjects(SUBJECTS)) for (const u of s.units) for (const t of u.topics) {
      expect(t).not.toHaveProperty("criteria");
      expect(t).not.toHaveProperty("misconceptions");
      expect(t.slug).toBeTruthy();
    }
  });

  it("resolves the topic id Demand shipped under before its code was corrected", () => {
    const econ = findSubject("ib-economics")!;
    const found = findTopic(econ, "u2-2-demand");
    expect(found?.topic.id).toBe("u2-1-demand");
    expect(found?.topic.code).toBe("2.1");
    expect(findTopic(econ, "u2-2-supply")?.topic.label).toBe("Supply");
  });
});
