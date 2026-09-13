import { and, asc, desc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/lib/db/client";
import {
  annotations,
  helpMessages,
  messageTags,
  messages,
  modelCalls,
  objectives,
  reviews,
  sessions,
  type AnnotationRow,
  type HelpMessageRow,
  type MessageRow,
  type MessageTagRow,
  type ObjectiveRow,
  type ReviewRow,
  type SessionRow,
  type StoredTopic,
  type SuggestedPractice,
} from "@/lib/db/schema";
import type { Confidence, Difficulty, MessageTag, ObjectiveStatus, SessionDepth } from "@/lib/jojo/contract";
import type { CallEnvelope } from "@/lib/jojo/leaves";

/**
 * Thin, typed data access. No business rules live here.
 *
 * Neon's HTTP driver has no interactive transactions, so every multi-row
 * write goes through `db.batch()`, which runs as one non-interactive
 * transaction: all statements commit or none do.
 */

const id = (p: string) => `${p}_${nanoid(14)}`;

export type NewSession = {
  userId: string;
  subjectId: string;
  subjectName: string;
  title: string;
  topics: StoredTopic[];
  topicMode: "topic" | "custom";
  focusText: string | null;
  difficulty: Difficulty;
  sessionDepth: SessionDepth;
  objectives: { text: string; topicId: string | null; topicLabel: string | null }[];
  maxTurns: number;
  opening: string;
};

export async function createSession(input: NewSession): Promise<SessionRow> {
  const sessionId = id("s");
  const [[row]] = await db.batch([
    db
      .insert(sessions)
      .values({
        id: sessionId,
        userId: input.userId,
        subjectId: input.subjectId,
        subjectName: input.subjectName,
        title: input.title,
        topics: input.topics,
        topicMode: input.topicMode,
        focusText: input.focusText,
        difficulty: input.difficulty,
        sessionDepth: input.sessionDepth,
        maxTurns: input.maxTurns,
      })
      .returning(),
    db.insert(objectives).values(
      input.objectives.map((o, i) => ({ id: id("o"), sessionId, text: o.text, topicId: o.topicId, topicLabel: o.topicLabel, orderIndex: i })),
    ),
    db.insert(messages).values({ id: id("m"), sessionId, role: "assistant", content: input.opening, turnIndex: 0 }),
  ]);
  return row;
}

export async function countSessionsToday(userId: string): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(sessions)
    .where(and(eq(sessions.userId, userId), sql`${sessions.createdAt} > now() - interval '1 day'`));
  return row?.n ?? 0;
}

export async function getSessionForUser(sessionId: string, userId: string): Promise<SessionRow | null> {
  const [row] = await db.select().from(sessions).where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId))).limit(1);
  return row ?? null;
}

export async function listSessionsForUser(userId: string, limit = 30) {
  const rows = await db.select().from(sessions).where(eq(sessions.userId, userId)).orderBy(desc(sessions.updatedAt)).limit(limit);
  if (rows.length === 0) return [] as (SessionRow & { objectives: ObjectiveRow[] })[];
  const objs = await db
    .select()
    .from(objectives)
    .where(inArray(objectives.sessionId, rows.map((r) => r.id)))
    .orderBy(asc(objectives.orderIndex));
  return rows.map((r) => ({ ...r, objectives: objs.filter((o) => o.sessionId === r.id) }));
}

export type SessionBundle = {
  session: SessionRow;
  objectives: ObjectiveRow[];
  messages: MessageRow[];
  tags: MessageTagRow[];
  help: HelpMessageRow[];
  review: (ReviewRow & { annotations: AnnotationRow[]; modelId: string | null }) | null;
};

export async function loadBundle(session: SessionRow): Promise<SessionBundle> {
  const [objs, msgs, tags, help, [review]] = await db.batch([
    db.select().from(objectives).where(eq(objectives.sessionId, session.id)).orderBy(asc(objectives.orderIndex)),
    db.select().from(messages).where(eq(messages.sessionId, session.id)).orderBy(asc(messages.turnIndex)),
    db.select().from(messageTags).where(eq(messageTags.sessionId, session.id)),
    db.select().from(helpMessages).where(eq(helpMessages.sessionId, session.id)).orderBy(asc(helpMessages.orderIndex)),
    db.select().from(reviews).where(eq(reviews.sessionId, session.id)).limit(1),
  ]);
  if (!review) return { session, objectives: objs, messages: msgs, tags, help, review: null };
  const [anns, [call]] = await db.batch([
    db.select().from(annotations).where(eq(annotations.reviewId, review.id)).orderBy(asc(annotations.orderIndex)),
    // Provenance: which model wrote this review. A mock review stays labelled as such after credentials are configured.
    db
      .select({ modelId: modelCalls.modelId })
      .from(modelCalls)
      .where(and(eq(modelCalls.sessionId, session.id), eq(modelCalls.kind, "review")))
      .orderBy(desc(modelCalls.createdAt))
      .limit(1),
  ]);
  return { session, objectives: objs, messages: msgs, tags, help, review: { ...review, annotations: anns, modelId: call?.modelId ?? null } };
}

/**
 * Claim a turn before the model is called. The unique (session, turnIndex)
 * index makes two tabs racing on the same transcript fail here, cheaply,
 * instead of after a paid model call.
 */
export async function claimUserTurn(sessionId: string, turnIndex: number, content: string, requestId?: string): Promise<{ userMessageId: string } | "conflict" | "finished"> {
  const userMessageId = id("m");
  try {
    // Conditional insert: a session that has left `started` (End Session raced us) takes no new turns.
    const rows = await db.execute<{ id: string }>(sql`
      insert into ${messages} (id, session_id, role, content, turn_index, request_id)
      select ${userMessageId}, s.id, 'user', ${content}, ${turnIndex}, ${requestId ?? null}
      from ${sessions} s where s.id = ${sessionId} and s.status = 'started'
      returning id`);
    return rows.rows.length === 1 ? { userMessageId } : "finished";
  } catch (error) {
    if (isUniqueViolation(error)) return "conflict";
    throw error;
  }
}

/** The stored exchange for a request id, if that send already committed. */
export async function findExchangeByRequest(sessionId: string, requestId: string) {
  const [user] = await db.select().from(messages).where(and(eq(messages.sessionId, sessionId), eq(messages.requestId, requestId))).limit(1);
  if (!user) return null;
  const [assistant] = await db.select().from(messages).where(and(eq(messages.sessionId, sessionId), eq(messages.turnIndex, user.turnIndex + 1))).limit(1);
  if (!assistant) return null;
  const [tag] = await db.select().from(messageTags).where(eq(messageTags.messageId, user.id)).limit(1);
  return { user, assistant, tag: (tag as MessageTagRow | undefined) ?? null };
}

export async function releaseUserTurn(userMessageId: string) {
  await db.delete(messages).where(eq(messages.id, userMessageId));
}

export type TurnCommit = {
  sessionId: string;
  userMessageId: string;
  assistantText: string;
  assistantTurnIndex: number;
  tag: { value: MessageTag; reason: string; quotes: string[] } | null;
  objectiveUpdates: { objectiveId: string; status: ObjectiveStatus }[];
  confidence: Confidence;
  /** Every objective is now completed, so the session moves to pending_completion regardless of the turn count. */
  allCompleted: boolean;
  envelope: CallEnvelope;
};

/**
 * Commit the assistant half of a turn atomically. Every write carries the same
 * fence, `the session is still started`, evaluated inside the one Neon batch
 * transaction, so a turn that lost the race with End Session writes nothing at
 * all (a zero-row UPDATE does not abort a Neon HTTP batch, so the fence has to
 * live in each statement rather than in a rollback). The turn counter is
 * incremented in SQL, not set from a value read earlier, so two overlapping
 * requests cannot both write the same count. Returns the committed counter and
 * status, or null when the fence failed and the claimed student message was
 * released.
 */
export async function commitTurn(w: TurnCommit): Promise<{ turnsUsed: number; status: SessionRow["status"] } | null> {
  const fence = sql`exists (select 1 from ${sessions} s where s.id = ${w.sessionId} and s.status = 'started')`;
  const statements = [
    db.execute(sql`insert into ${messages} (id, session_id, role, content, turn_index)
      select ${id("m")}, ${w.sessionId}, 'assistant', ${w.assistantText}, ${w.assistantTurnIndex} where ${fence}`),
    ...(w.tag
      ? [
          db.execute(sql`insert into ${messageTags} (id, session_id, message_id, tag, reason, quotes)
            select ${id("t")}, ${w.sessionId}, ${w.userMessageId}, ${w.tag.value}::teach_jojo_message_tag_value, ${w.tag.reason}, ${JSON.stringify(w.tag.quotes)}::jsonb where ${fence}`),
        ]
      : []),
    ...w.objectiveUpdates.map(
      (u) =>
        db.execute(sql`update ${objectives} set status = ${u.status}::teach_jojo_objective_status, updated_at = now()
          where id = ${u.objectiveId} and session_id = ${w.sessionId} and ${fence}`),
    ),
    modelCallInsert("turn", w.envelope, w.sessionId),
    // Last, so the earlier statements still see status = 'started' when the cap moves it to pending_completion.
    db
      .update(sessions)
      .set({
        confidence: w.confidence,
        turnsUsed: sql`${sessions.turnsUsed} + 1`,
        status: sql`(case when ${w.allCompleted} or ${sessions.turnsUsed} + 1 >= ${sessions.maxTurns} then 'pending_completion' else 'started' end)::teach_jojo_session_status`,
        updatedAt: new Date(),
      })
      .where(and(eq(sessions.id, w.sessionId), eq(sessions.status, "started")))
      .returning({ turnsUsed: sessions.turnsUsed, status: sessions.status }),
  ];
  const results = (await db.batch(statements as unknown as Parameters<typeof db.batch>[0])) as unknown as unknown[];
  const fenced = results.at(-1) as { turnsUsed: number; status: SessionRow["status"] }[];
  if (fenced.length === 1) return fenced[0];
  // Nothing else landed (every write shared the fence); release the claim so the session is not wedged.
  await db.delete(messages).where(eq(messages.id, w.userMessageId));
  return null;
}

/** True when the assistant reply for a turn has been committed; used to recognise a commit whose response was lost. */
export async function assistantReplyExists(sessionId: string, turnIndex: number): Promise<boolean> {
  const [row] = await db
    .select({ id: messages.id })
    .from(messages)
    .where(and(eq(messages.sessionId, sessionId), eq(messages.turnIndex, turnIndex), eq(messages.role, "assistant")))
    .limit(1);
  return Boolean(row);
}

/**
 * Reserve a help turn before the model is called: the student's row is inserted only
 * while the session holds fewer than `limit` student help messages, inside one
 * statement, so fifty concurrent requests cannot each pass a count check and start a
 * paid call. The unique (session, order_index) index makes racing inserts collide;
 * the caller retries a couple of times.
 */
export async function claimHelpTurn(sessionId: string, userText: string, afterMainMessageIndex: number, limit: number): Promise<{ id: string; orderIndex: number } | "limit"> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const helpId = id("h");
    try {
      const rows = await db.execute<{ id: string; order_index: number }>(sql`
        insert into ${helpMessages} (id, session_id, role, content, order_index, after_main_message_index)
        select ${helpId}, ${sessionId}, 'user', ${userText},
               (select count(*) from ${helpMessages} h where h.session_id = ${sessionId}), ${afterMainMessageIndex}
        where (select count(*) from ${helpMessages} u where u.session_id = ${sessionId} and u.role = 'user') < ${limit}
        returning id, order_index`);
      const row = rows.rows[0];
      return row ? { id: row.id, orderIndex: Number(row.order_index) } : "limit";
    } catch (error) {
      if (!isUniqueViolation(error) || attempt === 2) throw error;
    }
  }
  throw new Error("unreachable");
}

/** The tutor's reply for a claimed help turn, with the call envelope, in one batch. */
export async function completeHelpTurn(sessionId: string, orderIndex: number, assistantText: string, afterMainMessageIndex: number, envelope: CallEnvelope) {
  await db.batch([
    db.insert(helpMessages).values({ id: id("h"), sessionId, role: "assistant", content: assistantText, orderIndex, afterMainMessageIndex }),
    modelCallInsert("help", envelope, sessionId),
  ]);
}

/** A claimed help turn whose model call failed is removed so it neither shows nor counts. */
export async function releaseHelpTurn(helpId: string) {
  await db.delete(helpMessages).where(eq(helpMessages.id, helpId));
}

function modelCallInsert(kind: "turn" | "help" | "objectives" | "review" | "opening", envelope: CallEnvelope, sessionId: string | null) {
  return db.insert(modelCalls).values({
    id: id("c"),
    sessionId,
    kind,
    modelId: envelope.modelId,
    promptVersion: envelope.promptVersion,
    inputTokens: envelope.inputTokens,
    outputTokens: envelope.outputTokens,
    latencyMs: envelope.latencyMs,
    validation: envelope.validation,
  });
}

export async function recordModelCall(kind: "turn" | "help" | "objectives" | "review" | "opening", envelope: CallEnvelope, sessionId: string | null = null) {
  await modelCallInsert(kind, envelope, sessionId);
}

/**
 * Atomically claim review generation. Returns false if another caller holds
 * the claim or the review is already complete, so only one model call happens.
 */
export async function claimReview(sessionId: string): Promise<boolean> {
  const rows = await db
    .update(sessions)
    .set({ status: "pending_completion", reviewStatus: "generating", completedAt: sql`coalesce(${sessions.completedAt}, now())`, updatedAt: new Date() })
    .where(
      and(
        eq(sessions.id, sessionId),
        // Free, failed, or an abandoned claim older than two minutes (a crashed worker never publishes).
        or(isNull(sessions.reviewStatus), eq(sessions.reviewStatus, "failed"), and(eq(sessions.reviewStatus, "generating"), sql`${sessions.updatedAt} < now() - interval '2 minutes'`)),
        // No turn may be in flight: a student message without its reply means a model call is running.
        sql`not exists (select 1 from ${messages} u where u.session_id = ${sessions.id} and u.role = 'user' and not exists (select 1 from ${messages} a where a.session_id = u.session_id and a.turn_index = u.turn_index + 1))`,
      ),
    )
    .returning({ id: sessions.id });
  return rows.length === 1;
}

/**
 * A student message with no reply, older than the longest possible live turn,
 * is a claim whose worker died. Remove it so the session is usable again.
 * Budget: the route allows 60 s and the model leaf is capped below that
 * (see leaves.ts), so three minutes cannot release a turn that is still alive.
 */
export async function releaseStaleClaims(sessionId: string): Promise<number> {
  const rows = await db
    .delete(messages)
    .where(
      and(
        eq(messages.sessionId, sessionId),
        eq(messages.role, "user"),
        sql`${messages.createdAt} < now() - interval '180 seconds'`,
        sql`not exists (select 1 from ${messages} a where a.session_id = ${messages.sessionId} and a.turn_index = ${messages.turnIndex} + 1)`,
      ),
    )
    .returning({ id: messages.id });
  return rows.length;
}

export async function publishReview(
  sessionId: string,
  data: { strengths: string[]; weaknesses: string[]; suggestedPractice: SuggestedPractice[]; annotations: { turnIndex: number; type: AnnotationRow["type"]; comment: string }[] },
  envelope: CallEnvelope,
) {
  const reviewId = id("r");
  await db.batch([
    db.delete(reviews).where(eq(reviews.sessionId, sessionId)),
    db.insert(reviews).values({ id: reviewId, sessionId, strengths: data.strengths, weaknesses: data.weaknesses, suggestedPractice: data.suggestedPractice }),
    ...(data.annotations.length > 0
      ? [db.insert(annotations).values(data.annotations.map((a, i) => ({ id: id("a"), reviewId, turnIndex: a.turnIndex, type: a.type, comment: a.comment, orderIndex: i })))]
      : []),
    modelCallInsert("review", envelope, sessionId),
    // Objective statuses are left exactly as the session ended them (verified against the product on 13 Sep 2026:
    // an in-progress objective stays "In progress" after completion; needs_review is only ever set by Jojo giving up mid-session).
    db.update(sessions).set({ status: "completed", reviewStatus: "completed", updatedAt: new Date() }).where(eq(sessions.id, sessionId)),
  ] as unknown as Parameters<typeof db.batch>[0]);
}

export async function listObjectives(sessionId: string): Promise<ObjectiveRow[]> {
  return db.select().from(objectives).where(eq(objectives.sessionId, sessionId)).orderBy(asc(objectives.orderIndex));
}

export async function failReview(sessionId: string) {
  await db.update(sessions).set({ status: "completed", reviewStatus: "failed", updatedAt: new Date() }).where(eq(sessions.id, sessionId));
}

/** Header stats: ten XP per completed objective; streak is distinct days with a session in the last week. */
export async function userStats(userId: string) {
  const [row] = await db
    .select({
      xp: sql<number>`coalesce((select count(*) from ${objectives} o join ${sessions} s on s.id = o.session_id where s.user_id = ${userId} and o.status = 'completed'), 0)::int * 10`,
      days: sql<number>`coalesce((select count(distinct date_trunc('day', started_at)) from ${sessions} where user_id = ${userId} and started_at > now() - interval '7 days'), 0)::int`,
    })
    .from(sql`(select 1) as one`);
  return { xp: row?.xp ?? 0, streak: Math.max(row?.days ?? 0, 1) };
}

function isUniqueViolation(error: unknown): boolean {
  const code = (error as { code?: string; cause?: { code?: string } })?.code ?? (error as { cause?: { code?: string } })?.cause?.code;
  return code === "23505" || /unique|duplicate key/i.test(String((error as Error)?.message ?? ""));
}
