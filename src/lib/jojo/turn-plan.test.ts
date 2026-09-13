import { describe, expect, it } from "vitest";
import { countTrailingStalls, echoesHelp, planTurn, recentOpeners } from "./turn-plan";

describe("turn plan", () => {
  it("counts consecutive untagged student turns and resets on a tagged one", () => {
    expect(
      countTrailingStalls([
        { role: "user", content: "the membrane is a bilayer", tag: "good" },
        { role: "assistant", content: "ok" },
        { role: "user", content: "idk" },
        { role: "assistant", content: "hmm" },
        { role: "user", content: "not sure" },
      ]),
    ).toBe(2);
    expect(countTrailingStalls([{ role: "user", content: "x", tag: "great" }])).toBe(0);
  });

  it("collects Jojo's recent openers so the next reply cannot reuse them", () => {
    const openers = recentOpeners(
      [
        { role: "assistant", content: "yeah, that makes sense\n---\nbut why?" },
        { role: "user", content: "..." },
        { role: "assistant", content: "Okay wait, hold on\n---\nwhich side?" },
      ],
      2,
    );
    expect(openers).toEqual(["okay wait hold", "yeah that makes"]);
  });

  it("rotates the move by turn and adds half-right only above clueless", () => {
    const base = { messages: [], message: "x", helpReplies: [] };
    expect(planTurn({ ...base, turnsUsed: 0, difficulty: "clueless" }).move).toBe("mechanism");
    expect(planTurn({ ...base, turnsUsed: 1, difficulty: "clueless" }).move).toBe("example");
    expect(planTurn({ ...base, turnsUsed: 4, difficulty: "clueless" }).move).toBe("mechanism");
    expect(planTurn({ ...base, turnsUsed: 4, difficulty: "knows_a_bit" }).move).toBe("half_right");
  });

  it("flags a message that is mostly the tutor's hint pasted back, but not one in the student's own words", () => {
    const hint = "Mechanical energy is kinetic energy plus potential energy. In an ideal system there is no friction or air resistance, so the total stays the same.";
    expect(echoesHelp("mechanical energy is kinetic energy plus potential energy. in an ideal system there is no friction or air resistance so the total stays the same", [hint])).toBe(true);
    expect(echoesHelp("so basically the energy stays constant when nothing like friction steals it, kinetic and potential just trade places", [hint])).toBe(false);
    expect(echoesHelp("idk", [hint])).toBe(false);
  });
});

describe("stall ladder resets when an objective is closed; pasted hints in history are named", () => {
  it("does not count stalls from before the previous objective was closed", () => {
    const t0 = new Date("2026-09-13T10:00:00Z");
    const msgs = [
      { role: "user" as const, content: "idk", createdAt: new Date("2026-09-13T09:58:00Z"), turnIndex: 2 },
      { role: "assistant" as const, content: "no worries, moving on", createdAt: new Date("2026-09-13T09:59:00Z"), turnIndex: 3 },
      { role: "user" as const, content: "idk", createdAt: new Date("2026-09-13T10:01:00Z"), turnIndex: 4 },
    ];
    expect(countTrailingStalls(msgs)).toBe(2);
    expect(countTrailingStalls(msgs, t0)).toBe(1);
  });
  it("lists earlier student turns that were the tutor's hint pasted back", () => {
    const hint = "Mechanical energy is kinetic energy plus potential energy. In an ideal system there is no friction or air resistance, so the total stays the same.";
    const plan = planTurn({
      messages: [
        { role: "user", content: "mechanical energy is kinetic energy plus potential energy. in an ideal system there is no friction or air resistance so the total stays the same", turnIndex: 2 },
        { role: "assistant", content: "say it your way?", turnIndex: 3 },
      ],
      turnsUsed: 1,
      difficulty: "clueless",
      message: "another example is a cell in salty water",
      helpReplies: [hint],
    });
    expect(plan.echoedTurns).toEqual([2]);
    expect(plan.echoedHint).toBe(false);
  });
});

describe("echo detector against padding", () => {
  const hint = "Mechanical energy is kinetic energy plus potential energy. In an ideal system there is no friction or air resistance, so the total stays the same.";
  it("still fires when the paste is padded with unrelated chatter", () => {
    const padded = "mechanical energy is kinetic energy plus potential energy. in an ideal system there is no friction or air resistance so the total stays the same. i typed this on my phone while sitting by the window today and my friend is coming over later so i would like to keep going with the next part now please";
    expect(echoesHelp(padded, [hint])).toBe(true);
  });
});
