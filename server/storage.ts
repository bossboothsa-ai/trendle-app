import { db } from "./db";
import {
  users, places, posts, comments, likes, follows, rewards, userRewards, notifications,
  surveys, surveyResponses, dailyTasks, userDailyTasks,
  type User, type Place, type Post, type Comment, type Like, type Follow, type Reward, type Notification,
  type Survey, type SurveyResponse, type DailyTask, type UserDailyTask,
  type UserReward as SharedUserReward
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: Partial<User>): Promise<User>;
  updateUserPoints(id: number, points: number): Promise<User>;

  // Places
  getPlaces(): Promise<Place[]>;
  getPlace(id: number): Promise<Place | undefined>;
  createPlace(place: Partial<Place>): Promise<Place>;

  // Posts
  getPosts(filter?: string, placeId?: string): Promise<(Post & { author: User, place: Place | null, hasLiked: boolean })[]>; // Simplified return type for now
  createPost(post: Partial<Post>): Promise<Post>;
  getPost(id: number): Promise<Post | undefined>;

  // Interactions
  createLike(like: Partial<Like>): Promise<Like>;
  getLike(userId: number, postId: number): Promise<Like | undefined>;
  createComment(comment: Partial<Comment>): Promise<Comment>;
  getComments(postId: number): Promise<(Comment & { author: User })[]>;
  
  // Rewards
  getRewards(): Promise<Reward[]>;
  redeemReward(userId: number, rewardId: number, type: string): Promise<SharedUserReward>;
  getRewardHistory(userId: number): Promise<(SharedUserReward & { reward: Reward })[]>;

  // Surveys
  getSurveys(): Promise<Survey[]>;
  submitSurveyResponse(userId: number, surveyId: number, answers: any): Promise<SurveyResponse>;

  // Daily Tasks
  getDailyTasks(userId: number): Promise<(DailyTask & { completed: boolean })[]>;
  completeDailyTask(userId: number, taskId: number): Promise<UserDailyTask>;

  // Notifications
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notif: Partial<Notification>): Promise<Notification>;

  // Seed Helper
  seed(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(user: Partial<User>): Promise<User> {
    const [newUser] = await db.insert(users).values(user as any).returning();
    return newUser;
  }

  async updateUserPoints(id: number, points: number): Promise<User> {
    const [updated] = await db.update(users)
      .set({ 
        points: points,
        level: points >= 1500 ? "Platinum" : points >= 500 ? "Gold" : "Silver"
      })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async getPlaces(): Promise<Place[]> {
    return await db.select().from(places);
  }

  async getPlace(id: number): Promise<Place | undefined> {
    const [place] = await db.select().from(places).where(eq(places.id, id));
    return place;
  }

  async createPlace(place: Partial<Place>): Promise<Place> {
    const [newPlace] = await db.insert(places).values(place as any).returning();
    return newPlace;
  }

  async getPosts(filter?: string, placeId?: string): Promise<(Post & { author: User, place: Place | null, hasLiked: boolean })[]> {
    const conditions = [];
    if (placeId) conditions.push(eq(posts.placeId, parseInt(placeId)));
    
    // Note: This is a simplified fetch. In a real app we'd join properly.
    // For this mock, we'll fetch all and map.
    const allPosts = await db.select().from(posts)
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt));
      
    const results = [];
    for (const p of allPosts) {
      const [author] = await db.select().from(users).where(eq(users.id, p.userId));
      const [place] = p.placeId ? await db.select().from(places).where(eq(places.id, p.placeId)) : [undefined];
      
      // Check if "me" (User 1) liked it
      const [like] = await db.select().from(likes).where(and(eq(likes.postId, p.id), eq(likes.userId, 1)));

      if (author) {
        results.push({
          ...p,
          author,
          place: place || null,
          hasLiked: !!like
        });
      }
    }
    return results;
  }

  async createPost(post: Partial<Post>): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post as any).returning();
    // Award points
    const user = await this.getUser(post.userId!);
    if (user) {
      await this.updateUserPoints(user.id, user.points + 40 + (post.caption && post.caption.length > 20 ? 15 : 0));
    }
    return newPost;
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createLike(like: Partial<Like>): Promise<Like> {
    const [newLike] = await db.insert(likes).values(like as any).returning();
    // Increment post like count
    await db.execute(sql`UPDATE posts SET likes_count = likes_count + 1 WHERE id = ${like.postId}`);
    // Award point to liker
    const user = await this.getUser(like.userId!);
    if (user) await this.updateUserPoints(user.id, user.points + 1);
    return newLike;
  }

  async getLike(userId: number, postId: number): Promise<Like | undefined> {
    const [like] = await db.select().from(likes).where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
    return like;
  }

  async createComment(comment: Partial<Comment>): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment as any).returning();
    await db.execute(sql`UPDATE posts SET comments_count = comments_count + 1 WHERE id = ${comment.postId}`);
    const user = await this.getUser(comment.userId!);
    if (user) await this.updateUserPoints(user.id, user.points + 1);
    return newComment;
  }

  async getComments(postId: number): Promise<(Comment & { author: User })[]> {
    const comms = await db.select().from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));
      
    const results = [];
    for (const c of comms) {
      const [author] = await db.select().from(users).where(eq(users.id, c.userId));
      if (author) results.push({ ...c, author });
    }
    return results;
  }

  async getRewards(): Promise<Reward[]> {
    return await db.select().from(rewards);
  }

  async redeemReward(userId: number, rewardId: number, type: string): Promise<SharedUserReward> {
    const [reward] = await db.select().from(rewards).where(eq(rewards.id, rewardId));
    const user = await this.getUser(userId);
    
    if (!reward || !user) throw new Error("Invalid reward or user");
    if (user.points < reward.cost) throw new Error("Not enough points");

    await this.updateUserPoints(userId, user.points - reward.cost);
    const [redemption] = await db.insert(userRewards).values({ userId, rewardId, type, status: "pending" }).returning();
    return redemption;
  }

  async getRewardHistory(userId: number): Promise<(SharedUserReward & { reward: Reward })[]> {
    const history = await db.select().from(userRewards).where(eq(userRewards.userId, userId)).orderBy(desc(userRewards.redeemedAt));
    const results = [];
    for (const h of history) {
      const [reward] = await db.select().from(rewards).where(eq(rewards.id, h.rewardId));
      if (reward) results.push({ ...h, reward });
    }
    return results;
  }

  async getSurveys(): Promise<Survey[]> {
    return await db.select().from(surveys);
  }

  async submitSurveyResponse(userId: number, surveyId: number, answers: any): Promise<SurveyResponse> {
    const [survey] = await db.select().from(surveys).where(eq(surveys.id, surveyId));
    if (!survey) throw new Error("Survey not found");
    
    const [response] = await db.insert(surveyResponses).values({ userId, surveyId, answers }).returning();
    const user = await this.getUser(userId);
    if (user) await this.updateUserPoints(userId, user.points + survey.points);
    return response;
  }

  async getDailyTasks(userId: number): Promise<(DailyTask & { completed: boolean })[]> {
    const tasks = await db.select().from(dailyTasks);
    const results = [];
    for (const t of tasks) {
      const [comp] = await db.select().from(userDailyTasks).where(and(eq(userDailyTasks.userId, userId), eq(userDailyTasks.taskId, t.id)));
      results.push({ ...t, completed: !!comp });
    }
    return results;
  }

  async completeDailyTask(userId: number, taskId: number): Promise<UserDailyTask> {
    const [task] = await db.select().from(dailyTasks).where(eq(dailyTasks.id, taskId));
    if (!task) throw new Error("Task not found");
    
    const [comp] = await db.insert(userDailyTasks).values({ userId, taskId }).returning();
    const user = await this.getUser(userId);
    if (user) await this.updateUserPoints(userId, user.points + task.points);
    return comp;
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notif: Partial<Notification>): Promise<Notification> {
    const [n] = await db.insert(notifications).values(notif as any).returning();
    return n;
  }

  async seed(): Promise<void> {
    const existingUsers = await this.getUsers();
    if (existingUsers.length > 0) return;

    console.log("Seeding database...");

    // 1. Users
    const usersData = [
      { username: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100", points: 450, level: "Silver", bio: "Just loving Cape Town vibes!" },
      { username: "jessica_ct", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", points: 1200, level: "Gold", bio: "Coffee addict ☕️" },
      { username: "mike_surfer", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100", points: 2100, level: "Platinum", bio: "Waves & Vibes" },
      { username: "foodie_sam", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100", points: 800, level: "Gold", bio: "Eating my way through CBD" },
      { username: "travel_kai", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", points: 150, level: "Silver", bio: "New in town" }
    ];

    for (const u of usersData) await this.createUser(u);

    // 2. Places (Cape Town)
    const placesData = [
      { name: "The Bean Bar", description: "Best flat whites in De Waterkant.", location: "De Waterkant", distance: "0.4km", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500", category: "Coffee" },
      { name: "Truth Coffee", description: "Steampunk vibes and artisan roasts.", location: "Buitenkant St", distance: "1.2km", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500", category: "Coffee" },
      { name: "Clifton 4th", description: "Sunset sessions and white sand.", location: "Clifton", distance: "5.5km", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500", category: "Outdoors" },
      { name: "The Old Biscuit Mill", description: "Saturday markets & food stalls.", location: "Woodstock", distance: "3.2km", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500", category: "Food" },
      { name: "Yours Truly", description: "Rooftop drinks and leafy vibes.", location: "Kloof St", distance: "1.5km", image: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=500", category: "Nightlife" }
    ];

    for (const p of placesData) await this.createPlace(p);

    // 3. Posts
    const postsData = [
      { userId: 2, placeId: 1, image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500", caption: "Morning brew at my fav spot! ☕️", likesCount: 12, commentsCount: 2 },
      { userId: 3, placeId: 3, image: "https://images.unsplash.com/photo-1519046904884-53103b34b271?w=500", caption: "Nothing beats a Clifton sunset.", likesCount: 45, commentsCount: 5 },
      { userId: 4, placeId: 4, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500", caption: "Market day! The burgers here are insane.", likesCount: 23, commentsCount: 3 },
      { userId: 5, placeId: 5, image: "https://images.unsplash.com/photo-1536935338788-843bb6303645?w=500", caption: "Friday vibes on Kloof.", likesCount: 8, commentsCount: 1 }
    ];

    for (const p of postsData) await this.createPost(p);

    // 4. Rewards
    const rewardsData = [
      { title: "Free Coffee", description: "Redeem for any standard coffee", cost: 500, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200", locked: false },
      { title: "Cocktail Discount", description: "50% off your first drink", cost: 1000, image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?w=200", locked: true },
      { title: "R100 Voucher", description: "Spend at any partner venue", cost: 2500, image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=200", locked: true }
    ];
    
    for (const r of rewardsData) {
       await db.insert(rewards).values(r);
    }

    // 5. Surveys & Tasks
    await db.insert(surveys).values({
      title: "Cape Town Lifestyle",
      description: "Tell us about your favorite spots",
      points: 100,
      questions: [{ question: "How often do you visit CBD?", options: ["Daily", "Weekly", "Monthly"] }]
    });

    await db.insert(dailyTasks).values({
      title: "Morning Check-in",
      description: "Open the app before 10 AM",
      points: 10,
      type: "check-in"
    });

    // 6. Notifications
    await this.createNotification({ userId: 1, type: "like", actorId: 2, message: "Jessica liked your photo" });
    await this.createNotification({ userId: 1, type: "follow", actorId: 3, message: "Mike started following you" });
  }
}

export const storage = new DatabaseStorage();
