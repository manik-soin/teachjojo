import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MessageRow, ObjectiveRow, SessionRow } from "@/lib/db/schema";
import type { SessionBundle } from "./repo";

/**
 * Boundary tests for the use cases: the repository and the model leaves are
 * replaced with controllable fakes, so each high-consequence path (replay,
 * overlap, end-during-turn, claim races, recovery) is asserted directly.
 */
vi.mock("./repo", () => ({
  claimReview: vi.fn(),
  claimUserTurn: vi.fn(),
  commitTurn: vi.fn(),
  assistantReplyExists: vi.fn(),
  claimHelpTurn: vi.fn(),
  completeHelpTurn: vi.fn(),
  releaseHelpTurn: vi.fn(),
  findExchangeByRequest: vi.fn(),
  countSessionsToday: vi.fn(),
  createSession: vi.fn(),
  failReview: vi.fn(),
  getSessionForUser: vi.fn(),
  listObjectives: vi.fn(),
  loadBundle: vi.fn(),
  publishReview: vi.fn(),
  recordModelCall: vi.fn(),
  releaseStaleClaims: vi.fn(),
  releaseUserTurn: vi.fn(),
}));
vi.mock("@/lib/jojo/leaves", () => ({
  runJojoTurn: vi.fn(),
  runJojoTurnStreaming: vi.fn(),
  runHelpTurn: vi.fn(),
  runObjectiveGeneration: vi.fn(),
  runOpening: vi.fn(),
  runReview: vi.fn(),
}));
vi.mock("@/lib/jojo/model", () => ({ resolveModel: () => ({ model: {}, modelId: "fake", isMock: false }) }));

import * as repo from "./repo";
import * as leaves from "@/lib/jojo/leaves";
import { endSession, SessionError, takeTurn } from "./service";

const r = vi.mocked(repo);
const l = vi.mocked(leaves);

const session = (over: Partial<SessionRow> = {}): SessionRow =>
  ({
    id: "s1",
    userId: "u1",
    subjectId: "biology",
    subjectName: "Biology",
    title: "Water",
    topics: [{ id: "t1", code: "A1.1", label: "Water", unit: "A" }],
    topicMode: "topic",
    focusText: null,
    difficulty: "clueless",
    sessionDepth: "quick",
    status: "started",
    reviewStatus: null,
    confidence: "low",
    turnsUsed: 0,
    maxTurns: 8,
    startedAt: new Date(),
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  }) as SessionRow;

const objective = (id: string, status: ObjectiveRow["status"] = "not_started"): ObjectiveRow =>
  ({ id, sessionId: "s1", text: `Objective ${id}`, topicId: "t1", topicLabel: "A1.1 Water", status, orderIndex: 0, createdAt: new Date(), updatedAt: new Date() }) as ObjectiveRow;

const msg = (turnIndex: number, role: MessageRow["role"], content = "…"): MessageRow =>
  ({ id: `m${turnIndex}`, sessionId: "s1", role, content, turnIndex, requestId: null, createdAt: new Date() }) as MessageRow;

const bundle = (over: Partial<SessionBundle> = {}): SessionBundle => ({
  session: session(),
  objectives: [objective("o1"), objective("o2")],
  messages: [msg(0, "assistant", "hi")],
  tags: [],
  help: [],
  review: null,
  ...over,
});

const turnOutput = {
  output: {
    assessment: { evidence: "x", covered: [], canSayItBack: false, tag: { value: "good" as const, reason: "clear" } },
    objectiveUpdates: [{ objectiveId: "o1", status: "in_progress" as const }],
    confidence: "medium" as const,
    response: "oh ok",
  },
  envelope: { modelId: "fake", promptVersion: "test", latencyMs: 1, validation: "ok" as const },
};

beforeEach(() => {
  vi.resetAllMocks();
  r.getSessionForUser.mockImplementation(async (id, userId) => (id === "s1" && userId === "u1" ? session() : null));
  r.loadBundle.mockResolvedValue(bundle());
  r.releaseStaleClaims.mockResolvedValue(0);
  r.releaseUserTurn.mockResolvedValue(undefined);
  r.claimUserTurn.mockResolvedValue({ userMessageId: "mu" });
  r.commitTurn.mockResolvedValue({ turnsUsed: 1, status: "started" });
  r.assistantReplyExists.mockResolvedValue(false);
  l.runJojoTurn.mockResolvedValue(turnOutput);
});

describe("takeTurn: ownership and replay", () => {
  it("another user cannot reach the session at all", async () => {
    await expect(takeTurn({ sessionId: "s1", userId: "intruder", message: "x" })).rejects.toMatchObject({ code: "not_found" });
    expect(r.claimUserTurn).not.toHaveBeenCalled();
    expect(l.runJojoTurn).not.toHaveBeenCalled();
  });

  it("a retry with the same request id replays the stored exchange and spends no turn", async () => {
    r.findExchangeByRequest.mockResolvedValue({ user: msg(1, "user", "water is polar"), assistant: msg(2, "assistant", "oh\n---\nok"), tag: null });
    const res = await takeTurn({ sessionId: "s1", userId: "u1", message: "water is polar", requestId: "req-1" });
    expect(res.turnIndex).toBe(2);
    expect(res.bubbles).toEqual(["oh", "ok"]);
    expect(r.claimUserTurn).not.toHaveBeenCalled();
    expect(l.runJojoTurn).not.toHaveBeenCalled();
  });

  it("reusing a request id with different text is a conflict, not a silent replay", async () => {
    r.findExchangeByRequest.mockResolvedValue({ user: msg(1, "user", "original"), assistant: msg(2, "assistant", "x"), tag: null });
    await expect(takeTurn({ sessionId: "s1", userId: "u1", message: "edited", requestId: "req-1" })).rejects.toMatchObject({ code: "conflict" });
  });
});

describe("takeTurn: overlap and end-during-turn", () => {
  it("refuses while the previous student message has no reply yet", async () => {
    r.loadBundle.mockResolvedValue(bundle({ messages: [msg(0, "assistant"), msg(1, "user")] }));
    await expect(takeTurn({ sessionId: "s1", userId: "u1", message: "x" })).rejects.toMatchObject({ code: "conflict" });
    expect(l.runJojoTurn).not.toHaveBeenCalled();
  });

  it("a dead claim is released first, then the turn proceeds", async () => {
    r.loadBundle.mockResolvedValueOnce(bundle({ messages: [msg(0, "assistant"), msg(1, "user")] })).mockResolvedValueOnce(bundle());
    r.releaseStaleClaims.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    const res = await takeTurn({ sessionId: "s1", userId: "u1", message: "x" });
    expect(res.turnIndex).toBe(2);
    expect(r.claimUserTurn).toHaveBeenCalledWith("s1", 1, "x", undefined);
  });

  it("a claim refused because the session ended costs no model call", async () => {
    r.claimUserTurn.mockResolvedValue("finished");
    await expect(takeTurn({ sessionId: "s1", userId: "u1", message: "x" })).rejects.toMatchObject({ code: "finished" });
    expect(l.runJojoTurn).not.toHaveBeenCalled();
  });

  it("a failed commit fence reports 'finished' and does not delete the (already compensated) claim", async () => {
    r.commitTurn.mockResolvedValue(null);
    await expect(takeTurn({ sessionId: "s1", userId: "u1", message: "x" })).rejects.toMatchObject({ code: "finished" });
    expect(r.releaseUserTurn).not.toHaveBeenCalled();
  });

  it("a model failure releases the claim so the session is not wedged", async () => {
    l.runJojoTurn.mockRejectedValue(new Error("provider down"));
    await expect(takeTurn({ sessionId: "s1", userId: "u1", message: "x" })).rejects.toThrow("provider down");
    expect(r.releaseUserTurn).toHaveBeenCalledWith("mu");
    expect(r.commitTurn).not.toHaveBeenCalled();
  });

  it("a database failure after the model also releases the claim", async () => {
    r.commitTurn.mockRejectedValue(new Error("db down"));
    await expect(takeTurn({ sessionId: "s1", userId: "u1", message: "x" })).rejects.toThrow("db down");
    expect(r.releaseUserTurn).toHaveBeenCalledWith("mu");
  });

  it("completion needs evidence: a completed update on an untagged turn stays in progress", async () => {
    l.runJojoTurn.mockResolvedValue({
      ...turnOutput,
      output: { ...turnOutput.output, assessment: { evidence: "", covered: [], canSayItBack: true, tag: { value: null, reason: "" } }, objectiveUpdates: [{ objectiveId: "o1", status: "completed" }, { objectiveId: "ghost", status: "completed" }] },
    });
    const res = await takeTurn({ sessionId: "s1", userId: "u1", message: "x" });
    expect(res.objectives.find((o) => o.id === "o1")?.status).toBe("in_progress");
    expect(r.commitTurn.mock.calls[0][0].objectiveUpdates).toEqual([{ objectiveId: "o1", status: "in_progress" }]);
  });

  it("completion is refused when the quoted evidence is not in the student's message (ungrounded grade)", async () => {
    l.runJojoTurn.mockResolvedValue({
      ...turnOutput,
      output: { ...turnOutput.output, assessment: { evidence: "something the student never wrote", covered: [], canSayItBack: true, tag: { value: "great", reason: "r" } }, objectiveUpdates: [{ objectiveId: "o1", status: "completed" }] },
    });
    const res = await takeTurn({ sessionId: "s1", userId: "u1", message: "water is polar because oxygen pulls the shared electrons closer" });
    expect(res.objectives.find((o) => o.id === "o1")?.status).toBe("in_progress");
  });

  it("completion goes through when the grade is grounded in the student's words", async () => {
    const message = "water is polar because oxygen pulls the shared electrons closer, so the partial charges attract between molecules";
    l.runJojoTurn.mockResolvedValue({
      ...turnOutput,
      output: { ...turnOutput.output, assessment: { evidence: "oxygen pulls the shared electrons closer", covered: [], canSayItBack: true, tag: { value: "great", reason: "r" } }, objectiveUpdates: [{ objectiveId: "o1", status: "completed" }] },
    });
    const res = await takeTurn({ sessionId: "s1", userId: "u1", message });
    expect(res.objectives.find((o) => o.id === "o1")?.status).toBe("completed");
  });

  it("the response mirrors the counter and status the commit decided in SQL (the cap lives there)", async () => {
    r.loadBundle.mockResolvedValue(bundle({ session: session({ turnsUsed: 7, maxTurns: 8 }) }));
    r.commitTurn.mockResolvedValue({ turnsUsed: 8, status: "pending_completion" });
    const res = await takeTurn({ sessionId: "s1", userId: "u1", message: "x" });
    expect(res.status).toBe("pending_completion");
    expect(res.turnsUsed).toBe(8);
    expect(r.commitTurn.mock.calls[0][0].allCompleted).toBe(false);
  });

  it("a commit whose response was lost keeps the student's message under its reply instead of releasing it", async () => {
    r.commitTurn.mockRejectedValue(new Error("socket hang up"));
    r.assistantReplyExists.mockResolvedValue(true);
    r.getSessionForUser.mockResolvedValue(session({ turnsUsed: 1 }));
    r.listObjectives.mockResolvedValue([objective("o1", "in_progress")]);
    const res = await takeTurn({ sessionId: "s1", userId: "u1", message: "x" });
    expect(res.turnsUsed).toBe(1);
    expect(r.releaseUserTurn).not.toHaveBeenCalled();
  });
});

describe("endSession: claims and recovery", () => {
  const reviewOutput = {
    output: { strengths: ["a", "A "], weaknesses: ["b"], annotations: [{ turnIndex: 1, type: "positive" as const, comment: "nice" }, { turnIndex: 2, type: "negative" as const, comment: "not a student turn" }] },
    envelope: { modelId: "fake", promptVersion: "test", latencyMs: 1, validation: "ok" as const },
  };

  beforeEach(() => {
    r.claimReview.mockResolvedValue(true);
    r.listObjectives.mockResolvedValue([objective("o1", "completed"), objective("o2", "needs_review")]);
    l.runReview.mockResolvedValue(reviewOutput);
  });

  it("a live review worker (fresh 'generating') means in_progress and no second model call", async () => {
    r.loadBundle.mockResolvedValue(bundle({ session: session({ reviewStatus: "generating", updatedAt: new Date() }) }));
    const res = await endSession({ sessionId: "s1", userId: "u1" });
    expect(res.outcome).toBe("in_progress");
    expect(r.claimReview).not.toHaveBeenCalled();
  });

  it("a review claim abandoned for over two minutes is taken over", async () => {
    r.loadBundle.mockResolvedValue(bundle({ session: session({ reviewStatus: "generating", updatedAt: new Date(Date.now() - 3 * 60_000) }), messages: [msg(0, "assistant"), msg(1, "user", "x"), msg(2, "assistant")] }));
    const res = await endSession({ sessionId: "s1", userId: "u1" });
    expect(r.releaseStaleClaims).toHaveBeenCalledWith("s1");
    expect(r.claimReview).toHaveBeenCalledWith("s1");
    expect(res.outcome).toBe("completed");
  });

  it("losing the claim race yields in_progress", async () => {
    r.claimReview.mockResolvedValue(false);
    const res = await endSession({ sessionId: "s1", userId: "u1" });
    expect(res.outcome).toBe("in_progress");
    expect(l.runReview).not.toHaveBeenCalled();
  });

  it("nothing taught: publishes an honest empty review without a model call", async () => {
    const res = await endSession({ sessionId: "s1", userId: "u1" });
    expect(res.outcome).toBe("completed");
    expect(l.runReview).not.toHaveBeenCalled();
    expect(r.publishReview.mock.calls[0][1].strengths).toEqual([]);
    expect(r.publishReview.mock.calls[0][2].modelId).toBe("none");
  });

  it("dedupes strengths and drops annotations that do not point at a student turn", async () => {
    r.loadBundle.mockResolvedValue(bundle({ messages: [msg(0, "assistant"), msg(1, "user", "x"), msg(2, "assistant")] }));
    await endSession({ sessionId: "s1", userId: "u1" });
    const published = r.publishReview.mock.calls[0][1];
    expect(published.strengths).toEqual(["a"]);
    expect(published.annotations).toEqual([{ turnIndex: 1, type: "positive", comment: "nice" }]);
  });

  it("a review model failure marks the review failed instead of leaving the claim", async () => {
    r.loadBundle.mockResolvedValue(bundle({ messages: [msg(0, "assistant"), msg(1, "user", "x"), msg(2, "assistant")] }));
    l.runReview.mockRejectedValue(new Error("boom"));
    const res = await endSession({ sessionId: "s1", userId: "u1" });
    expect(res.outcome).toBe("failed");
    expect(r.failReview).toHaveBeenCalledWith("s1");
  });

  it("an already reviewed session is reported as done, with no new work", async () => {
    r.loadBundle.mockResolvedValue(bundle({ session: session({ reviewStatus: "completed", status: "completed" }), review: { id: "r", sessionId: "s1", strengths: [], weaknesses: [], suggestedPractice: [], createdAt: new Date(), annotations: [], modelId: "fake" } as never }));
    const res = await endSession({ sessionId: "s1", userId: "u1" });
    expect(res.outcome).toBe("already_done");
    expect(r.claimReview).not.toHaveBeenCalled();
  });
});

describe("SessionError", () => {
  it("carries its code", () => {
    expect(new SessionError("limit", "x").code).toBe("limit");
  });
});
