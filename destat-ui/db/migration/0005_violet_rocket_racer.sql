CREATE TABLE "daily_live_survey" (
	"id" serial PRIMARY KEY NOT NULL,
	"count" bigint DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "daily_visitor" RENAME COLUMN "created_at" TO "day_start";--> statement-breakpoint
ALTER TABLE "daily_visitor" ADD CONSTRAINT "daily_visitor_day_start_unique" UNIQUE("day_start");