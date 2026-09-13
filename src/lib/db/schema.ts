import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * Mirrors RevisionDojo's own Teach Jojo tables (their Drizzle schema ships in the
 * public client bundle): a session row, one row per objective, a main transcript,
 * a separate "help" transcript, per-message tags, and a generated review with
 * per-turn annotations. Column names match theirs where the concept exists.
 * `model_calls` is ours: the envelope that makes a turn reproducible.
 */

export const difficulty = pgEnum("teach_jojo_difficulty", ["clueless", "knows_a_bit", "pretty_familiar"]);
export const sessionDepth = pgEnum("teach_jojo_session_depth", ["quick", "in_depth"]);
export const topicMode = pgEnum("teach_jojo_topic_mode", ["topic", "custom"]);
export const sessionStatus = pgEnum("teach_jojo_session_status", ["started", "pending_completion", "completed"]);
export const objectiveStatus = pgEnum("teach_jojo_objective_status", ["not_started", "in_progress", "completed", "needs_review"]);
export const reviewStatus = pgEnum("teach_jojo_review_status", ["generating", "completed", "failed"]);
export const messageTagValue = pgEnum("teach_jojo_message_tag_value", ["great", "good", "inaccurate", "mistake"]);
export const annotationType = pgEnum("teach_jojo_annotation_type", ["positive", "negative", "neutral"]);

export type StoredTopic = { id: string; code: string; label: string; unit: string };

export const sessions = pgTable(
  "teach_jojo_session",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    subjectId: text("subject_id").notNull(),
    subjectName: text("subject_name").notNull(),
    title: text("title").notNull(),
    topics: jsonb("topics").$type<StoredTopic[]>().notNull(),
    topicMode: topicMode("topic_mode").notNull(),
    focusText: text("focus_text"),
    difficulty: difficulty("difficulty").notNull().default("clueless"),
    sessionDepth: sessionDepth("session_depth").notNull().default("quick"),
    status: sessionStatus("status").notNull().default("started"),
    reviewStatus: reviewStatus("review_status"),
    confidence: text("confidence").$type<"low" | "medium" | "high">().notNull().default("low"),
    turnsUsed: integer("turns_used").notNull().default(0),
    maxTurns: integer("max_turns").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("idx_tj_session_user_status_updated").on(t.userId, t.status, t.updatedAt)],
);

export const objectives = pgTable(
  "teach_jojo_session_objective",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    topicId: text("topic_id"),
    topicLabel: text("topic_label"),
    text: text("text").notNull(),
    status: objectiveStatus("status").notNull().default("not_started"),
    orderIndex: integer("order_index").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("tj_objective_session_order_unique").on(t.sessionId, t.orderIndex)],
);

export const messages = pgTable(
  "teach_jojo_message",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    role: text("role").$type<"user" | "assistant">().notNull(),
    /** Assistant content keeps the model's `---` bubble separators; the UI splits. */
    content: text("content").notNull(),
    turnIndex: integer("turn_index").notNull(),
    /** Client-generated per send. A retry with the same id replays the stored exchange instead of spending a turn. */
    requestId: text("request_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("tj_message_session_turn_unique").on(t.sessionId, t.turnIndex), uniqueIndex("tj_message_session_request_unique").on(t.sessionId, t.requestId)],
);

export const helpMessages = pgTable(
  "teach_jojo_help_message",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    role: text("role").$type<"user" | "assistant">().notNull(),
    content: text("content").notNull(),
    orderIndex: integer("order_index").notNull(),
    /** Which main-transcript turn the student was on when they asked. Drives the "You asked Jojo for help" divider. */
    afterMainMessageIndex: integer("after_main_message_index"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("tj_help_session_order_unique").on(t.sessionId, t.orderIndex)],
);

export const messageTags = pgTable(
  "teach_jojo_message_tag",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    messageId: text("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    tag: messageTagValue("tag").notNull(),
    reason: text("reason").notNull(),
    /** Verbatim spans of the student message the tag rests on; the UI underlines exactly these (the product's `quotes`). */
    quotes: jsonb("quotes").$type<string[]>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("tj_tag_session_message_unique").on(t.sessionId, t.messageId)],
);

export type SuggestedPractice = {
  title: string;
  topicLabel: string;
  kind: "Flashcards" | "Notes" | "Question Bank" | "Videos";
  topicId: string | null;
  /** Path into RevisionDojo's resource library (e.g. `/ib/ib-physics-new/ib-physics-new-a1-kinematics/flashcards`), null for custom material. */
  url?: string | null;
};

export const reviews = pgTable(
  "teach_jojo_session_review",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" })
      .unique(),
    strengths: jsonb("strengths").$type<string[]>().notNull(),
    weaknesses: jsonb("weaknesses").$type<string[]>().notNull(),
    suggestedPractice: jsonb("suggested_practice").$type<SuggestedPractice[]>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

export const annotations = pgTable(
  "teach_jojo_message_annotation",
  {
    id: text("id").primaryKey(),
    reviewId: text("review_id")
      .notNull()
      .references(() => reviews.id, { onDelete: "cascade" }),
    turnIndex: integer("turn_index").notNull(),
    type: annotationType("type").notNull(),
    comment: text("comment").notNull(),
    orderIndex: integer("order_index").notNull(),
  },
  (t) => [index("idx_tj_annotation_review").on(t.reviewId)],
);

export const modelCalls = pgTable("teach_jojo_model_call", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").references(() => sessions.id, { onDelete: "cascade" }),
  kind: text("kind").$type<"turn" | "help" | "objectives" | "review" | "opening">().notNull(),
  modelId: text("model_id").notNull(),
  promptVersion: text("prompt_version").notNull(),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  latencyMs: integer("latency_ms").notNull(),
  validation: text("validation").$type<"ok" | "repaired" | "failed">().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SessionRow = typeof sessions.$inferSelect;
export type ObjectiveRow = typeof objectives.$inferSelect;
export type MessageRow = typeof messages.$inferSelect;
export type HelpMessageRow = typeof helpMessages.$inferSelect;
export type MessageTagRow = typeof messageTags.$inferSelect;
export type ReviewRow = typeof reviews.$inferSelect;
export type AnnotationRow = typeof annotations.$inferSelect;
