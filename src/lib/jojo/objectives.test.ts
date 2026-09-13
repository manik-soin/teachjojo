import { describe, expect, it } from "vitest";
import type { Objective } from "./contract";
import { allCompleted, applyObjectiveUpdates, coversAllCriteria, isGrounded, isStall, lexicallySupported, maxTurnsFor, stripWrappingQuotes } from "./objectives";

const base: Objective[] = [
  { id: "a", text: "Describe the membrane", status: "not_started" },
  { id: "b", text: "Explain osmosis", status: "in_progress" },
  { id: "c", text: "Compare diffusion types", status: "completed" },
];

describe("applyObjectiveUpdates", () => {
  it("applies forward transitions and reports what was applied", () => {
    const { objectives, applied } = applyObjectiveUpdates(
      base,
      [
        { objectiveId: "a", status: "in_progress" },
        { objectiveId: "b", status: "completed" },
      ],
      { tag: "great" },
    );
    expect(objectives.map((o) => o.status)).toEqual(["in_progress", "completed", "completed"]);
    expect(applied).toHaveLength(2);
  });

  it("drops unknown objective ids", () => {
    const { objectives, applied } = applyObjectiveUpdates(base, [{ objectiveId: "zzz", status: "completed" }]);
    expect(objectives).toEqual(base);
    expect(applied).toEqual([]);
  });

  it("never demotes a completed objective", () => {
    const { objectives } = applyObjectiveUpdates(base, [{ objectiveId: "c", status: "in_progress" }]);
    expect(objectives[2].status).toBe("completed");
  });

  it("blocks completion on the turn a mistake was flagged", () => {
    const { objectives, applied } = applyObjectiveUpdates(base, [{ objectiveId: "b", status: "completed" }], { tag: "inaccurate" });
    expect(objectives[1].status).toBe("in_progress");
    expect(applied).toEqual([]);
  });

  it("blocks completion without a great or good tag (no evidence, no mastery)", () => {
    const { objectives } = applyObjectiveUpdates(base, [{ objectiveId: "a", status: "completed" }], { tag: null });
    expect(objectives[0].status).toBe("in_progress");
  });

  it("allows needs_review from in_progress but not a silent reset to not_started", () => {
    const { objectives } = applyObjectiveUpdates(base, [
      { objectiveId: "b", status: "needs_review" },
      { objectiveId: "a", status: "not_started" },
    ]);
    expect(objectives[1].status).toBe("needs_review");
    expect(objectives[0].status).toBe("not_started");
  });

  it("lets a needs_review objective recover to in_progress on a good turn, but not on a stall", () => {
    const flagged: Objective[] = [{ id: "a", text: "x", status: "needs_review" }];
    expect(applyObjectiveUpdates(flagged, [{ objectiveId: "a", status: "in_progress" }], { tag: "good" }).objectives[0].status).toBe("in_progress");
    expect(applyObjectiveUpdates(flagged, [{ objectiveId: "a", status: "in_progress" }], { tag: null }).objectives[0].status).toBe("needs_review");
  });

  it("collapses repeated updates for one objective into a single applied row", () => {
    const { applied } = applyObjectiveUpdates(base, [
      { objectiveId: "a", status: "in_progress" },
      { objectiveId: "a", status: "needs_review" },
    ]);
    expect(applied).toEqual([{ objectiveId: "a", status: "needs_review" }]);
  });
});

describe("session bounds", () => {
  it("caps turns at 16 and gives 4 per objective", () => {
    expect(maxTurnsFor(1, "quick")).toBe(4);
    expect(maxTurnsFor(3, "quick")).toBe(12);
    expect(maxTurnsFor(9, "quick")).toBe(16);
    expect(maxTurnsFor(3, "in_depth")).toBe(18);
    expect(maxTurnsFor(9, "in_depth")).toBe(24);
  });
  it("allCompleted is false for empty lists", () => {
    expect(allCompleted([])).toBe(false);
  });
});

describe("isGrounded", () => {
  const msg = "Water is polar because oxygen pulls the shared electrons closer; the partial charges attract between molecules.";
  it("accepts a verbatim quote regardless of case and punctuation", () => {
    expect(isGrounded(msg, { evidence: "oxygen pulls the shared electrons closer", canSayItBack: true })).toBe(true);
    expect(isGrounded(msg, { evidence: "Oxygen pulls the shared electrons closer!", canSayItBack: true })).toBe(true);
  });
  it("rejects paraphrase, tiny quotes and a failed say-it-back check", () => {
    expect(isGrounded(msg, { evidence: "oxygen attracts electrons", canSayItBack: true })).toBe(false);
    expect(isGrounded(msg, { evidence: "water", canSayItBack: true })).toBe(false);
    expect(isGrounded(msg, { evidence: "oxygen pulls the shared electrons closer", canSayItBack: false })).toBe(false);
  });
});

describe("rubric gate", () => {
  const withRubric: Objective = { id: "m", text: "Describe the membrane", status: "in_progress", criteria: ["a phospholipid bilayer", "proteins embedded in or spanning the bilayer"] };
  it("passes objectives without a rubric", () => {
    expect(coversAllCriteria({ criteria: undefined }, [])).toBe(true);
  });
  it("needs every required idea, tolerating case, punctuation and a trimmed clause", () => {
    expect(coversAllCriteria(withRubric, ["A phospholipid bilayer."])).toBe(false);
    expect(coversAllCriteria(withRubric, ["a phospholipid bilayer", "Proteins embedded in or spanning the bilayer"])).toBe(true);
    expect(coversAllCriteria(withRubric, ["a phospholipid bilayer", "proteins embedded in the bilayer"])).toBe(false);
  });
  it("holds completion at in_progress when the caller refuses it", () => {
    const { objectives } = applyObjectiveUpdates([withRubric], [{ objectiveId: "m", status: "completed" }], { tag: "great", completeAllowed: () => false });
    expect(objectives[0].status).toBe("in_progress");
  });
});

describe("isGrounded with a truncated long quote", () => {
  it("accepts a long quote whose first 80 normalised characters are verbatim even if the tail is garbled", () => {
    const msg = "oxygen is more electronegative than hydrogen so it pulls the shared electrons towards itself. that leaves the oxygen end slightly negative and the two hydrogen ends slightly positive";
    expect(isGrounded(msg, { evidence: msg.slice(0, 120) + " one水?", canSayItBack: true })).toBe(true);
    expect(isGrounded(msg, { evidence: "oxygen pulls electrons and makes bonds because reasons that were never said here at all", canSayItBack: true })).toBe(false);
  });
});

describe("stalls and quote hygiene", () => {
  it("recognises the ways students decline to answer, but not short real answers", () => {
    for (const s of ["i don't know", "I dont know", "idk", "not sure", "no idea", "i forgot", "dunno", "pass", "??", ""]) expect(isStall(s)).toBe(true);
    for (const s of ["distance doesnt", "vector vs scalar", "osmosis", "it's a bilayer made of phospholipids", "yes"]) expect(isStall(s)).toBe(s === "yes");
    // A stall phrase inside an attempt is not a stall: the grader judges the content.
    for (const s of ["help me understand osmosis first", "i forgot to say the membrane is a bilayer", "unsure but i think it is a bilayer", "pass the salt is not physics", "idk maybe water", "water", "F=ma"]) expect(isStall(s)).toBe(false);
    for (const s of ["hmm sorry", "idk tbh", "no idea about that", "ok", "??"]) expect(isStall(s)).toBe(true);
  });
  it("strips the quotation marks models wrap around evidence", () => {
    expect(stripWrappingQuotes("“how much demand changes when price changes”")).toBe("how much demand changes when price changes");
    expect(stripWrappingQuotes("'plain'")).toBe("plain");
  });
  it("grounds a quote regardless of typographic quotes", () => {
    expect(isGrounded("PED is how much demand changes when price changes", { evidence: "“how much demand changes when price changes”", canSayItBack: true })).toBe(true);
  });
});

describe("lexical support for covered ideas", () => {
  it("accepts an idea whose distinctive words the student actually used, on a five-letter stem", () => {
    expect(lexicallySupported("oxygen is more electronegative, so the shared electrons sit closer to it", "oxygen has higher electronegativity so the electrons sit nearer it")).toBe(true);
  });
  it("rejects an idea the student never mentioned", () => {
    expect(lexicallySupported("hydrophilic phosphate heads face the water and hydrophobic tails point inwards", "the plasma membrane is a phospholipid bilayer")).toBe(false);
  });
  it("passes ideas made only of short words on the grader's judgement", () => {
    expect(lexicallySupported("so it is not the same", "anything")).toBe(true);
  });
  it("no longer accepts a trimmed clause as covering a required idea", () => {
    expect(coversAllCriteria({ criteria: ["hydrophilic phosphate heads face the water and hydrophobic tails point inwards"] }, ["hydrophilic phosphate heads face the water and hydrophobic tails"])).toBe(false);
  });
});
