import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  email: text("email").notNull(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(), // user, admin
  emailVerified: boolean("email_verified").default(false).notNull(),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: timestamp("verification_token_expiry"),
  avatar: text("avatar").notNull(), // URL to avatar image
  level: text("level").default("Silver").notNull(), // Silver, Gold, Platinum
  points: integer("points").default(0).notNull(),
  bio: text("bio"),
  location: text("location"),
  interests: jsonb("interests").$type<string[]>().default([]).notNull(), // e.g., ["coffee", "hiking"]
  isPrivate: boolean("is_private").default(false).notNull(),
  // Admin fields
  status: text("status").default("active").notNull(), // active, suspended, deactivated
  riskScore: text("risk_score").default("Low").notNull(), // Low, Medium, High
  warnings: integer("warnings").default(0).notNull(),
  adminNotes: text("admin_notes"),
  // Anti-fraud fields
  phoneNumber: text("phone_number"),
  phoneVerified: boolean("phone_verified").default(false).notNull(),
  deviceId: text("device_id"),
  publicActivityId: text("public_activity_id").unique(), // TRND-AX001 format
  isFlagged: boolean("is_flagged").default(false).notNull(),
  flagReason: text("flag_reason"),
  notificationSettings: jsonb("notification_settings").$type<{
    likes: boolean;
    comments: boolean;
    follows: boolean;
    rewards: boolean;
    places: boolean;
  }>().default({
    likes: true,
    comments: true,
    follows: true,
    rewards: true,
    places: true,
  }).notNull(),
  privacySettings: jsonb("privacy_settings").$type<{
    showPoints: boolean;
    canSeeMoments: "everyone" | "followers" | "none";
    canComment: "everyone" | "followers" | "none";
  }>().default({
    showPoints: true,
    canSeeMoments: "everyone",
    canComment: "everyone",
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pointsHistory = pgTable("points_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(), // e.g., "Daily Check-in", "Post Liked"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const places = pgTable("places", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(), // e.g., "De Waterkant"
  distance: text("distance").notNull(), // e.g., "0.8km"
  image: text("image").notNull(),
  pointsPerVisit: integer("points_per_visit").default(50).notNull(),
  activeOffers: integer("active_offers").default(1).notNull(),
  category: text("category").default("General"), // Coffee, Nightlife, etc.
  tags: jsonb("tags").$type<string[]>().default([]).notNull(), // e.g., ["wifi", "quiet"]
  gallery: jsonb("gallery").$type<string[]>().default([]).notNull(), // Additional images
});

export interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  placeId: integer("place_id"), // Optional check-in
  media: jsonb("media").$type<MediaItem[]>().notNull(), // Array of { type: 'image'|'video', url: string }
  caption: text("caption"),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(), // e.g., ["summer", "vibes"]
  likesCount: integer("likes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Anti-fraud fields
  imageHash: text("image_hash"),
  checkedInAt: timestamp("checked_in_at"),
  pointsAwarded: integer("points_awarded").default(0).notNull(),
  isWithinTimeWindow: boolean("is_within_time_window").default(false).notNull(),
  // GPS Location Fields
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  locationName: text("location_name"),
  locationTimestamp: timestamp("location_timestamp"),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull(),
  followingId: integer("following_id").notNull(),
});


export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  cost: integer("cost").notNull(),
  locked: boolean("locked").default(true).notNull(),
  category: text("category").default("product").notNull(),
  placeId: integer("place_id"), // Link to specific business
});

export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  points: integer("points").notNull(),
  questions: jsonb("questions").notNull(),
  placeId: integer("place_id"), // Link to specific business
  active: boolean("active").default(true).notNull(),
  accessRequirement: text("access_requirement").default("checkin_required").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyTasks = pgTable("daily_tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  points: integer("points").notNull(),
  type: text("type").notNull(),
  placeId: integer("place_id"), // Link to specific business
  active: boolean("active").default(true).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  maxParticipants: integer("max_participants"),
  verificationMethod: text("verification_method").default("QR Verified").notNull(),
});


export const userRewards = pgTable("user_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  rewardId: integer("reward_id").notNull(),
  status: text("status").default("pending").notNull(), // pending, paid, settled
  type: text("type").notNull(), // airtime, voucher, discount
  code: text("code"),
  qrCode: text("qr_code"),
  isUsed: boolean("is_used").default(false).notNull(),
  expiryDate: timestamp("expiry_date"),
  redeemedAt: timestamp("redeemed_at").defaultNow().notNull(),
});

export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  surveyId: integer("survey_id").notNull(),
  answers: jsonb("answers").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userDailyTasks = pgTable("user_daily_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  taskId: integer("task_id").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Recipient
  type: text("type").notNull(), // "like", "comment", "follow"
  actorId: integer("actor_id").notNull(), // Who did it
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  media: jsonb("media").$type<MediaItem[]>().notNull(), // { type: 'image'|'video', url: string }
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cashouts = pgTable("cashouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(), // in points
  status: text("status").default("pending").notNull(), // pending, approved, paid, rejected
  type: text("type").notNull(), // bank, mobile, airtime
  details: jsonb("details").notNull(), // payout info
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Anti-fraud fields
  reviewStatus: text("review_status").default("pending").notNull(), // pending, approved, rejected
  reviewedAt: timestamp("reviewed_at"),
  lastCashoutAt: timestamp("last_cashout_at"),
});

export const checkins = pgTable("checkins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  placeId: integer("place_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const businessDailyMetrics = pgTable("business_daily_metrics", {
  id: serial("id").primaryKey(),
  placeId: integer("place_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  visits: integer("visits").default(0).notNull(),
  moments: integer("moments").default(0).notNull(),
  engagement: integer("engagement").default(0).notNull(), // likes + comments
  rating: integer("rating").default(0).notNull(), // Avg rating * 10
});

export const reportExports = pgTable("report_exports", {
  id: serial("id").primaryKey(),
  placeId: integer("place_id").notNull(),
  type: text("type").notNull(), // PDF, Excel
  reportName: text("report_name").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const businessAuditLog = pgTable("business_audit_log", {
  id: serial("id").primaryKey(),
  placeId: integer("place_id").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// === ANTI-FRAUD TABLES ===

export const deviceFingerprints = pgTable("device_fingerprints", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  deviceId: text("device_id").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const imageHashes = pgTable("image_hashes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  postId: integer("post_id"),
  hash: text("hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fraudFlags = pgTable("fraud_flags", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // The user being reported/flagged
  postId: integer("post_id"), // Optional content link
  commentId: integer("comment_id"), // Optional content link
  reporterId: integer("reporter_id"), // Who reported it (null if system)
  reason: text("reason").notNull(),
  severity: text("severity").default("low").notNull(), // low, medium, high
  status: text("status").default("pending").notNull(), // pending, investigating, resolved, dismissed
  adminNotes: text("admin_notes"),
  actionTaken: text("action_taken"), // warn, suspend, delete_content
  resolved: boolean("resolved").default(false).notNull(), // Deprecated in favor of status, keeping for compat if needed or just use as derived
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const businessAccounts = pgTable("business_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Linked User ID
  businessName: text("business_name").notNull(),
  placeId: integer("place_id").notNull(), // Link to the venue they manage
  // Status & Subscription
  status: text("status").default("active").notNull(), // active, suspended, deactivated, pending_email_verification, pending_admin_approval
  subscriptionPlan: text("subscription_plan").default("basic").notNull(), // basic, pro, enterprise
  subscriptionStatus: text("subscription_status").default("active").notNull(), // active, past_due, canceled
  monthlyFee: integer("monthly_fee").default(0).notNull(),
  invoiceDueDays: integer("invoice_due_days").default(7).notNull(),
  gracePeriod: integer("grace_period").default(48).notNull(),
  // Invoice & Billing
  lastInvoiceDate: text("last_invoice_date"),
  nextInvoiceDate: text("next_invoice_date"),
  billingAddress: text("billing_address"),
  taxId: text("tax_id"),
  invoiceStatus: text("invoice_status").default("Paid").notNull(), // Paid, Due, Overdue
  // Contact Info
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  contactPerson: text("contact_person"),
  city: text("city"),
  address: text("address"),
  category: text("category"), // Bar, Café, Restaurant, Other
  // Email Verification
  emailVerified: boolean("email_verified").default(false).notNull(),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: timestamp("verification_token_expiry"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userDailyLimits = pgTable("user_daily_limits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  likesCount: integer("likes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
});

export const verificationRequests = pgTable("verification_requests", {
  id: serial("id").primaryKey(),
  placeId: integer("place_id").notNull(),
  status: text("status").default("pending").notNull(), // pending, verified, rejected
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  stats: jsonb("stats").$type<{
    totalCheckins: number;
    uniqueIds: number;
    qrVerified: number;
    locationVerified: number;
    manual: number;
    anomalies: string;
  }>().notNull(),
});

export const systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(), // e.g., "User Warned", "Business Verified"
  adminId: integer("admin_id"),
  entityId: integer("entity_id"), // ID of affected object
  entityType: text("entity_type"), // "user", "business", "post"
  details: jsonb("details").$type<any>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define manual Zod schemas for JSONB fields to help Drizzle-Zod
const mediaItemSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string(),
  thumbnail: z.string().optional(),
});

export const insertUserSchema = createInsertSchema(users, {
  interests: z.array(z.string()),
  notificationSettings: z.any(),
  privacySettings: z.any(),
}).omit({ id: true, points: true, level: true });

export const insertPlaceSchema = createInsertSchema(places, {
  tags: z.array(z.string()),
  gallery: z.array(z.string()),
}).omit({ id: true });

export const insertPostSchema = createInsertSchema(posts, {
  media: z.array(mediaItemSchema),
  tags: z.array(z.string()),
}).omit({ id: true, createdAt: true, likesCount: true, commentsCount: true });

export const insertStorySchema = createInsertSchema(stories, {
  media: z.array(mediaItemSchema),
}).omit({ id: true, createdAt: true });

export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
export const insertLikeSchema = createInsertSchema(likes).omit({ id: true });
export const insertFollowSchema = createInsertSchema(follows).omit({ id: true });
export const insertRewardSchema = createInsertSchema(rewards).omit({ id: true });
export const insertSurveySchema = createInsertSchema(surveys).omit({ id: true });
export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({ id: true, createdAt: true });
export const insertDailyTaskSchema = createInsertSchema(dailyTasks).omit({ id: true });

export const insertPointsHistorySchema = createInsertSchema(pointsHistory).omit({ id: true, createdAt: true });
export const insertCashoutSchema = createInsertSchema(cashouts).omit({ id: true, createdAt: true, updatedAt: true });

export type Story = typeof stories.$inferSelect;

// === RELATIONS ===

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  followers: many(follows, { relationName: "userFollowers" }),
  following: many(follows, { relationName: "userFollowing" }),
  rewards: many(userRewards),
  notifications: many(notifications),
  surveyResponses: many(surveyResponses),
  dailyTasks: many(userDailyTasks),
  pointsHistory: many(pointsHistory),
  cashouts: many(cashouts),
  deviceFingerprints: many(deviceFingerprints),
  fraudFlags: many(fraudFlags),
  dailyLimits: many(userDailyLimits),
  verificationRequests: many(verificationRequests),
  systemLogs: many(systemLogs),
}));

export const pointsHistoryRelations = relations(pointsHistory, ({ one }) => ({
  user: one(users, {
    fields: [pointsHistory.userId],
    references: [users.id],
  }),
}));

export const placesRelations = relations(places, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  place: one(places, {
    fields: [posts.placeId],
    references: [places.id],
  }),
  comments: many(comments),
  likes: many(likes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

export const userRewardsRelations = relations(userRewards, ({ one }) => ({
  user: one(users, {
    fields: [userRewards.userId],
    references: [users.id],
  }),
  reward: one(rewards, {
    fields: [userRewards.rewardId],
    references: [rewards.id],
  }),
}));

export const surveyResponsesRelations = relations(surveyResponses, ({ one }) => ({
  user: one(users, {
    fields: [surveyResponses.userId],
    references: [users.id],
  }),
  survey: one(surveys, {
    fields: [surveyResponses.surveyId],
    references: [surveys.id],
  }),
}));

export const userDailyTasksRelations = relations(userDailyTasks, ({ one }) => ({
  user: one(users, {
    fields: [userDailyTasks.userId],
    references: [users.id],
  }),
  task: one(dailyTasks, {
    fields: [userDailyTasks.taskId],
    references: [dailyTasks.id],
  }),
}));

export const storiesRelations = relations(stories, ({ one }) => ({
  user: one(users, {
    fields: [stories.userId],
    references: [users.id],
  }),
}));

export const deviceFingerprintsRelations = relations(deviceFingerprints, ({ one }) => ({
  user: one(users, {
    fields: [deviceFingerprints.userId],
    references: [users.id],
  }),
}));

export const imageHashesRelations = relations(imageHashes, ({ one }) => ({
  user: one(users, {
    fields: [imageHashes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [imageHashes.postId],
    references: [posts.id],
  }),
}));

export const fraudFlagsRelations = relations(fraudFlags, ({ one }) => ({
  user: one(users, {
    fields: [fraudFlags.userId],
    references: [users.id],
  }),
}));

export const userDailyLimitsRelations = relations(userDailyLimits, ({ one }) => ({
  user: one(users, {
    fields: [userDailyLimits.userId],
    references: [users.id],
  }),
}));


export const rewardsRelations = relations(rewards, ({ one }) => ({
  place: one(places, {
    fields: [rewards.placeId],
    references: [places.id],
  }),
}));

export const surveysRelations = relations(surveys, ({ one }) => ({
  place: one(places, {
    fields: [surveys.placeId],
    references: [places.id],
  }),
}));

export const dailyTasksRelations = relations(dailyTasks, ({ one }) => ({
  place: one(places, {
    fields: [dailyTasks.placeId],
    references: [places.id],
  }),
}));

export const checkinsRelations = relations(checkins, ({ one }) => ({
  user: one(users, {
    fields: [checkins.userId],
    references: [users.id],
  }),
  place: one(places, {
    fields: [checkins.placeId],
    references: [places.id],
  }),
}));

export const businessDailyMetricsRelations = relations(businessDailyMetrics, ({ one }) => ({
  place: one(places, {
    fields: [businessDailyMetrics.placeId],
    references: [places.id],
  }),
}));

// === INFER TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PointsHistory = typeof pointsHistory.$inferSelect;
export type Place = typeof places.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Reward = typeof rewards.$inferSelect;
export type UserReward = typeof userRewards.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Survey = typeof surveys.$inferSelect;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type DailyTask = typeof dailyTasks.$inferSelect;
export type UserDailyTask = typeof userDailyTasks.$inferSelect;
export type Cashout = typeof cashouts.$inferSelect;
export type DeviceFingerprint = typeof deviceFingerprints.$inferSelect;
export type ImageHash = typeof imageHashes.$inferSelect;
export type FraudFlag = typeof fraudFlags.$inferSelect;
export type UserDailyLimit = typeof userDailyLimits.$inferSelect;
export type BusinessAccount = typeof businessAccounts.$inferSelect;
export type InsertBusinessAccount = typeof businessAccounts.$inferInsert;
export type Checkin = typeof checkins.$inferSelect;
export type BusinessDailyMetric = typeof businessDailyMetrics.$inferSelect;
export type ReportExport = typeof reportExports.$inferSelect;
export type BusinessAuditLog = typeof businessAuditLog.$inferSelect;

// === INSERT SCHEMAS ===

export const insertDeviceFingerprintSchema = createInsertSchema(deviceFingerprints).omit({ id: true, createdAt: true });
export const insertImageHashSchema = createInsertSchema(imageHashes).omit({ id: true, createdAt: true });
export const insertFraudFlagSchema = createInsertSchema(fraudFlags).omit({ id: true, createdAt: true });
export const insertUserDailyLimitSchema = createInsertSchema(userDailyLimits).omit({ id: true });
export const insertBusinessAccountSchema = createInsertSchema(businessAccounts).omit({ id: true, createdAt: true });
export const insertCheckinSchema = createInsertSchema(checkins).omit({ id: true, createdAt: true });
export const insertBusinessDailyMetricSchema = createInsertSchema(businessDailyMetrics).omit({ id: true });
export const insertReportExportSchema = createInsertSchema(reportExports).omit({ id: true, createdAt: true });
export const insertBusinessAuditLogSchema = createInsertSchema(businessAuditLog).omit({ id: true, createdAt: true });

// === NEW TYPES ===
export type VerificationRequest = typeof verificationRequests.$inferSelect;
export type SystemLog = typeof systemLogs.$inferSelect;

export const insertVerificationRequestSchema = createInsertSchema(verificationRequests).omit({ id: true, requestedAt: true, resolvedAt: true });
export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({ id: true, createdAt: true });

// === NEW RELATIONS ===
export const verificationRequestsRelations = relations(verificationRequests, ({ one }) => ({
  place: one(places, {
    fields: [verificationRequests.placeId],
    references: [places.id],
  }),
}));

export const systemLogsRelations = relations(systemLogs, ({ one }) => ({
  admin: one(users, {
    fields: [systemLogs.adminId],
    references: [users.id],
  }),
}));
