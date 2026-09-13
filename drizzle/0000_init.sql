CREATE TYPE "public"."teach_jojo_annotation_type" AS ENUM('positive', 'negative', 'neutral');--> statement-breakpoint
CREATE TYPE "public"."teach_jojo_difficulty" AS ENUM('clueless', 'knows_a_bit', 'pretty_familiar');--> statement-breakpoint
CREATE TYPE "public"."teach_jojo_message_tag_value" AS ENUM('great', 'good', 'inaccurate', 'mistake');--> statement-breakpoint
CREATE TYPE "public"."teach_jojo_objective_status" AS ENUM('not_started', 'in_progress', 'completed', 'needs_review');--> statement-breakpoint
CREATE TYPE "public"."teach_jojo_review_status" AS ENUM('generating', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."teach_jojo_session_depth" AS ENUM('quick', 'in_depth');--> statement-breakpoint
CREATE TYPE "public"."teach_jojo_session_status" AS ENUM('started', 'pending_completion', 'completed');--> statement-breakpoint
CREATE TYPE "public"."teach_jojo_topic_mode" AS ENUM('topic', 'custom');--> statement-breakpoint
CREATE TABLE "teach_jojo_message_annotation" (
	"id" text PRIMARY KEY NOT NULL,
	"review_id" text NOT NULL,
	"turn_index" integer NOT NULL,
	"type" "teach_jojo_annotation_type" NOT NULL,
	"comment" text NOT NULL,
	"order_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teach_jojo_help_message" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"order_index" integer NOT NULL,
	"after_main_message_index" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teach_jojo_message_tag" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"message_id" text NOT NULL,
	"tag" "teach_jojo_message_tag_value" NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teach_jojo_message" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"turn_index" integer NOT NULL,
	"request_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teach_jojo_model_call" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text,
	"kind" text NOT NULL,
	"model_id" text NOT NULL,
	"prompt_version" text NOT NULL,
	"input_tokens" integer,
	"output_tokens" integer,
	"latency_ms" integer NOT NULL,
	"validation" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teach_jojo_session_objective" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"topic_id" text,
	"topic_label" text,
	"text" text NOT NULL,
	"status" "teach_jojo_objective_status" DEFAULT 'not_started' NOT NULL,
	"order_index" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teach_jojo_session_review" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"strengths" jsonb NOT NULL,
	"weaknesses" jsonb NOT NULL,
	"suggested_practice" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teach_jojo_session_review_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "teach_jojo_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"subject_name" text NOT NULL,
	"title" text NOT NULL,
	"topics" jsonb NOT NULL,
	"topic_mode" "teach_jojo_topic_mode" NOT NULL,
	"focus_text" text,
	"difficulty" "teach_jojo_difficulty" DEFAULT 'clueless' NOT NULL,
	"session_depth" "teach_jojo_session_depth" DEFAULT 'quick' NOT NULL,
	"status" "teach_jojo_session_status" DEFAULT 'started' NOT NULL,
	"review_status" "teach_jojo_review_status",
	"confidence" text DEFAULT 'low' NOT NULL,
	"turns_used" integer DEFAULT 0 NOT NULL,
	"max_turns" integer NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "teach_jojo_message_annotation" ADD CONSTRAINT "teach_jojo_message_annotation_review_id_teach_jojo_session_review_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."teach_jojo_session_review"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teach_jojo_help_message" ADD CONSTRAINT "teach_jojo_help_message_session_id_teach_jojo_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."teach_jojo_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teach_jojo_message_tag" ADD CONSTRAINT "teach_jojo_message_tag_session_id_teach_jojo_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."teach_jojo_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teach_jojo_message_tag" ADD CONSTRAINT "teach_jojo_message_tag_message_id_teach_jojo_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."teach_jojo_message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teach_jojo_message" ADD CONSTRAINT "teach_jojo_message_session_id_teach_jojo_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."teach_jojo_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teach_jojo_model_call" ADD CONSTRAINT "teach_jojo_model_call_session_id_teach_jojo_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."teach_jojo_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teach_jojo_session_objective" ADD CONSTRAINT "teach_jojo_session_objective_session_id_teach_jojo_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."teach_jojo_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teach_jojo_session_review" ADD CONSTRAINT "teach_jojo_session_review_session_id_teach_jojo_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."teach_jojo_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_tj_annotation_review" ON "teach_jojo_message_annotation" USING btree ("review_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tj_help_session_order_unique" ON "teach_jojo_help_message" USING btree ("session_id","order_index");--> statement-breakpoint
CREATE UNIQUE INDEX "tj_tag_session_message_unique" ON "teach_jojo_message_tag" USING btree ("session_id","message_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tj_message_session_turn_unique" ON "teach_jojo_message" USING btree ("session_id","turn_index");--> statement-breakpoint
CREATE UNIQUE INDEX "tj_message_session_request_unique" ON "teach_jojo_message" USING btree ("session_id","request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tj_objective_session_order_unique" ON "teach_jojo_session_objective" USING btree ("session_id","order_index");--> statement-breakpoint
CREATE INDEX "idx_tj_session_user_status_updated" ON "teach_jojo_session" USING btree ("user_id","status","updated_at");