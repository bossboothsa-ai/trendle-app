import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  avatar: text("avatar").notNull(), // URL to avatar image
  level: text("level").default("Silver").notNull(), // Silver, Gold, Platinum
  points: integer("points").default(0).notNull(),
  bio: text("bio"),
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
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  placeId: integer("place_id"), // Optional check-in
  image: text("image").notNull(),
  caption: text("caption"),
  likesCount: integer("likes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
});

export const userRewards = pgTable("user_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  rewardId: integer("reward_id").notNull(),
  redeemedAt: timestamp("redeemed_at").defaultNow().notNull(),
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

// === RELATIONS ===

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  followers: many(follows, { relationName: "userFollowers" }),
  following: many(follows, { relationName: "userFollowing" }),
  rewards: many(userRewards),
  notifications: many(notifications),
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

// === INFER TYPES ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, points: true, level: true });
export const insertPlaceSchema = createInsertSchema(places).omit({ id: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true, likesCount: true, commentsCount: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
export const insertLikeSchema = createInsertSchema(likes).omit({ id: true });
export const insertFollowSchema = createInsertSchema(follows).omit({ id: true });
export const insertRewardSchema = createInsertSchema(rewards).omit({ id: true });

export type User = typeof users.$inferSelect;
export type Place = typeof places.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Reward = typeof rewards.$inferSelect;
export type UserReward = typeof userRewards.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
