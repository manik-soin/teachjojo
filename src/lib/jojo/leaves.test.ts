import { describe, expect, it } from "vitest";
import { runJojoTurn, runReview } from "./leaves";
import { createMockJojoModel } from "./mock-model";

const ref = { model: createMockJojoModel(), modelId: "mock" };
const context = {
  subjectName: "Biology",
  topics: [{ label: "B2.1 Membranes" }],
  objectives: [
    { id: "m:0", text: "Explain the direction of osmosis", status: "not_started" as const },
    { id: "m:1", text: "Describe the structure of the plasma membrane", status: "not_started" as const },
  ],
  difficulty: "clueless" as const,
  sessionDepth: "quick" as const,
  turnsUsed: 0,
  maxTurns: 8,
};

describe("runJojoTurn (model leaf, mock model)", () => {
  it("returns a typed output and a call envelope", async () => {
    const { output, envelope } = await runJojoTurn(ref, context, [
      { role: "user", content: "water moves from where there is more water to where there is less water across the membrane because of the concentration gradient" },
    ]);
    expect(output.confidence).toMatch(/low|medium|high/);
    expect(output.objectiveUpdates.every((u) => ["m:0", "m:1"].includes(u.objectiveId))).toBe(true);
    expect(envelope.promptVersion).toMatch(/^teach-jojo\//);
    expect(envelope.validation).toBe("ok");
  });

  it("tags a reversed claim as inaccurate without completing the objective", async () => {
    const { output } = await runJojoTurn(ref, context, [{ role: "user", content: "water always moves from more solute to less solute" }]);
    expect(output.assessment.tag.value).toBe("inaccurate");
    expect(output.objectiveUpdates.some((u) => u.status === "completed")).toBe(false);
  });
});

describe("runReview", () => {
  it("produces strengths, weaknesses and per-turn annotations", async () => {
    const { output } = await runReview(ref, context, [
      { turnIndex: 0, role: "assistant", content: "hi" },
      { turnIndex: 1, role: "user", content: "the plasma membrane is a phospholipid bilayer with embedded proteins whose hydrophilic heads face the water and hydrophobic tails point inward controlling what enters the cell" },
      { turnIndex: 2, role: "assistant", content: "ok" },
      { turnIndex: 3, role: "user", content: "idk" },
    ]);
    expect(output.strengths.length).toBeGreaterThan(0);
    expect(output.weaknesses.length).toBeGreaterThan(0);
    expect(output.annotations.map((a) => a.turnIndex)).toEqual(expect.arrayContaining([1, 3]));
  });
});
