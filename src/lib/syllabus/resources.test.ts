import { describe, expect, it } from "vitest";
import { findSubject, findTopic } from "./data";
import { resourceUrl, topicSlug } from "./resources";

/** Expected paths were fetched from the live site on 13 Sep 2026 and returned 200 with the matching topic title. */
describe("resource library URLs", () => {
  it("builds the product's topic slugs from code and label", () => {
    expect(topicSlug(findSubject("ib-biology")!, { code: "A2.2", label: "Cell structure" })).toBe("ib-biology-new-a22-cell-structure");
    expect(topicSlug(findSubject("ib-chemistry")!, { code: "S2.2", label: "The covalent model" })).toBe("ib-chemistry-new-s22-the-covalent-model");
    expect(topicSlug(findSubject("ib-economics")!, { code: "1.1", label: "What is economics?" })).toBe("ib-economics-11-what-is-economics");
    expect(topicSlug(findSubject("ib-physics")!, { code: "B.1", label: "Thermal energy transfers" })).toBe("ib-physics-new-b1-thermal-energy-transfers");
  });

  it("prefers the slug read from the site when the title alone would not reproduce it", () => {
    const bio = findSubject("ib-biology")!;
    expect(topicSlug(bio, findTopic(bio, "b2-2-organelles")!.topic)).toBe("ib-biology-new-b22-organelles-and-compartmentalization");
    const phys = findSubject("ib-physics")!;
    expect(topicSlug(phys, findTopic(phys, "a4-rigid-body")!.topic)).toBe("ib-physics-new-a4-rigid-body-mechanics");
    const econ = findSubject("ib-economics")!;
    expect(topicSlug(econ, findTopic(econ, "u2-4-critique-maximizing")!.topic)).toBe("ib-economics-24-critique-of-the-maximizing-behaviour-of-consumers-and-11048");
    expect(resourceUrl(econ, findTopic(econ, "u2-1-demand")!.topic, "Notes")).toBe("/ib/ib-economics/ib-economics-21-demand/notes");
  });

  it("maps each practice kind to its library path, videos at the topic root", () => {
    const physics = findSubject("ib-physics")!;
    const kin = { code: "A.1", label: "Kinematics" };
    expect(resourceUrl(physics, kin, "Flashcards")).toBe("/ib/ib-physics-new/ib-physics-new-a1-kinematics/flashcards");
    expect(resourceUrl(physics, kin, "Notes")).toBe("/ib/ib-physics-new/ib-physics-new-a1-kinematics/notes");
    expect(resourceUrl(physics, kin, "Question Bank")).toBe("/ib/ib-physics-new/ib-physics-new-a1-kinematics/questionbank");
    expect(resourceUrl(physics, { code: "A.2", label: "Forces and momentum" }, "Videos")).toBe("/ib/ib-physics-new/ib-physics-new-a2-forces-and-momentum");
  });
});
