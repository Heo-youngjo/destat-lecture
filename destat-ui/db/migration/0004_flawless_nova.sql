ALTER TABLE "daily_visitor" RENAME COLUMN "day_start" TO "created_at";--> statement-breakpoint
ALTER TABLE "answer" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "survey" ADD COLUMN "created_at" timestamp DEFAULT now();