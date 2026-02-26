CREATE TABLE "business_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"business_name" text NOT NULL,
	"place_id" integer NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"subscription_plan" text DEFAULT 'basic' NOT NULL,
	"subscription_status" text DEFAULT 'active' NOT NULL,
	"monthly_fee" integer DEFAULT 0 NOT NULL,
	"invoice_due_days" integer DEFAULT 7 NOT NULL,
	"grace_period" integer DEFAULT 48 NOT NULL,
	"last_invoice_date" text,
	"next_invoice_date" text,
	"billing_address" text,
	"tax_id" text,
	"invoice_status" text DEFAULT 'Paid' NOT NULL,
	"contact_phone" text,
	"contact_email" text,
	"contact_person" text,
	"city" text,
	"address" text,
	"category" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"verification_token" text,
	"verification_token_expiry" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"place_id" integer NOT NULL,
	"action" text NOT NULL,
	"details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_daily_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"place_id" integer NOT NULL,
	"date" text NOT NULL,
	"visits" integer DEFAULT 0 NOT NULL,
	"moments" integer DEFAULT 0 NOT NULL,
	"engagement" integer DEFAULT 0 NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cashouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"type" text NOT NULL,
	"details" jsonb NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"review_status" text DEFAULT 'pending' NOT NULL,
	"reviewed_at" timestamp,
	"last_cashout_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "checkins" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"place_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"points" integer NOT NULL,
	"type" text NOT NULL,
	"place_id" integer,
	"active" boolean DEFAULT true NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"max_participants" integer,
	"verification_method" text DEFAULT 'QR Verified' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "device_fingerprints" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"device_id" text NOT NULL,
	"user_agent" text,
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"date" text NOT NULL,
	"check_ins" integer DEFAULT 0 NOT NULL,
	"unique_check_ins" integer DEFAULT 0 NOT NULL,
	"posts" integer DEFAULT 0 NOT NULL,
	"engagement" integer DEFAULT 0 NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"return_intent" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_attendees" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"checked_in" boolean DEFAULT false NOT NULL,
	"checked_in_at" timestamp,
	"check_in_method" text,
	"points_earned" integer DEFAULT 0 NOT NULL,
	"post_bonus_earned" integer DEFAULT 0 NOT NULL,
	"posts_count" integer DEFAULT 0 NOT NULL,
	"rating" integer,
	"feedback" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_moments" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"experience_zone" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"cover_image" text,
	"venue_id" integer NOT NULL,
	"host_id" integer,
	"host_type" text DEFAULT 'business' NOT NULL,
	"host_name" text NOT NULL,
	"category" text NOT NULL,
	"start_date_time" timestamp NOT NULL,
	"end_date_time" timestamp NOT NULL,
	"points_reward" integer DEFAULT 100 NOT NULL,
	"post_bonus_points" integer DEFAULT 50 NOT NULL,
	"check_in_method" text DEFAULT 'gps' NOT NULL,
	"status" text DEFAULT 'upcoming' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_trending" boolean DEFAULT false NOT NULL,
	"max_attendees" integer,
	"location" text,
	"latitude" text,
	"longitude" text,
	"qr_code" text,
	"approved_by" integer,
	"approved_at" timestamp,
	"rejection_reason" text,
	"promotion_tier" text DEFAULT 'basic' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_id" integer NOT NULL,
	"following_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fraud_flags" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"post_id" integer,
	"comment_id" integer,
	"reporter_id" integer,
	"reason" text NOT NULL,
	"severity" text DEFAULT 'low' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"action_taken" text,
	"resolved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "host_event_promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"host_id" integer NOT NULL,
	"tier" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'ZAR' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_method" text,
	"payment_id" text,
	"invoice_number" text,
	"invoice_url" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"paid_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "image_hashes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"post_id" integer,
	"hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"actor_id" integer NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"location" text NOT NULL,
	"distance" text NOT NULL,
	"image" text NOT NULL,
	"points_per_visit" integer DEFAULT 50 NOT NULL,
	"active_offers" integer DEFAULT 1 NOT NULL,
	"category" text DEFAULT 'General',
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"gallery" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "points_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"place_id" integer,
	"media" jsonb NOT NULL,
	"caption" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"image_hash" text,
	"checked_in_at" timestamp,
	"points_awarded" integer DEFAULT 0 NOT NULL,
	"is_within_time_window" boolean DEFAULT false NOT NULL,
	"latitude" numeric,
	"longitude" numeric,
	"location_name" text,
	"location_timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE "report_exports" (
	"id" serial PRIMARY KEY NOT NULL,
	"place_id" integer NOT NULL,
	"type" text NOT NULL,
	"report_name" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"cost" integer NOT NULL,
	"locked" boolean DEFAULT true NOT NULL,
	"category" text DEFAULT 'product' NOT NULL,
	"place_id" integer
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"media" jsonb NOT NULL,
	"caption" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "survey_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"survey_id" integer NOT NULL,
	"answers" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "surveys" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"points" integer NOT NULL,
	"questions" jsonb NOT NULL,
	"place_id" integer,
	"active" boolean DEFAULT true NOT NULL,
	"access_requirement" text DEFAULT 'checkin_required' NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"action" text NOT NULL,
	"admin_id" integer,
	"entity_id" integer,
	"entity_type" text,
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_daily_limits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" text NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_daily_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"task_id" integer NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"reward_id" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"type" text NOT NULL,
	"code" text,
	"qr_code" text,
	"is_used" boolean DEFAULT false NOT NULL,
	"expiry_date" timestamp,
	"redeemed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"is_host" boolean DEFAULT false NOT NULL,
	"host_name" text,
	"host_bio" text,
	"host_avatar" text,
	"host_verified" boolean DEFAULT false NOT NULL,
	"host_created_at" timestamp,
	"host_membership_tier" text,
	"host_membership_status" text DEFAULT 'inactive' NOT NULL,
	"host_application_status" text,
	"host_application_date" timestamp,
	"host_membership_start_date" timestamp,
	"host_membership_end_date" timestamp,
	"host_categories" jsonb,
	"payment_reference" text,
	"proof_of_payment" text,
	"payment_verified" boolean DEFAULT false NOT NULL,
	"payment_date" timestamp,
	"email_verified" boolean DEFAULT false NOT NULL,
	"verification_token" text,
	"verification_token_expiry" timestamp,
	"avatar" text NOT NULL,
	"level" text DEFAULT 'Silver' NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"bio" text,
	"location" text,
	"interests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"risk_score" text DEFAULT 'Low' NOT NULL,
	"warnings" integer DEFAULT 0 NOT NULL,
	"admin_notes" text,
	"phone_number" text,
	"phone_verified" boolean DEFAULT false NOT NULL,
	"device_id" text,
	"public_activity_id" text,
	"is_flagged" boolean DEFAULT false NOT NULL,
	"flag_reason" text,
	"notification_settings" jsonb DEFAULT '{"likes":true,"comments":true,"follows":true,"rewards":true,"places":true}'::jsonb NOT NULL,
	"privacy_settings" jsonb DEFAULT '{"showPoints":true,"canSeeMoments":"everyone","canComment":"everyone"}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_public_activity_id_unique" UNIQUE("public_activity_id")
);
--> statement-breakpoint
CREATE TABLE "verification_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"place_id" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"stats" jsonb NOT NULL
);
