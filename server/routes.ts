import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage"; // Using persistent storage
import { api } from "@shared/routes";
import { z } from "zod";
import { insertCheckinSchema } from "@shared/schema";
import { registerBusinessRoutes } from "./businessRoutes";
import { registerAdminRoutes } from "./adminRoutes";
import { setupAuth } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Setup Authentication
  setupAuth(app);

  // Seed data on startup
  await storage.seed();

  // === USERS ===
  app.get(api.users.me.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  app.get(api.users.suggested.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const users = await storage.getSuggestedUsers((req.user as any).id);
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get(api.users.pointsHistory.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const history = await storage.getTransactions((req.user as any).id);
      res.json(history);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get(api.users.redemptionHistory.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const history = await storage.getRewardHistory((req.user as any).id);
      res.json(history);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get(api.users.list.path, async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get(api.users.get.path, async (req, res) => {
    const user = await storage.getUser(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  app.put(api.users.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.users.update.input.parse(req.body);
      const user = await storage.updateUser(id, input as any);
      res.json(user);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(404).json({ message: err.message });
    }
  });

  app.post(api.users.follow.path, async (req, res) => {
    try {
      const followingId = Number(req.params.id);
      const followerId = 1; // Hardcoded me
      const follow = await storage.createFollow(followerId, followingId);
      res.json({ success: true, follow });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post(api.users.unfollow.path, async (req, res) => {
    try {
      const followingId = Number(req.params.id);
      const followerId = 1; // Hardcoded me
      await storage.unfollowUser(followerId, followingId);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });



  // === PLACES ===
  app.get(api.places.list.path, async (req, res) => {
    try {
      const places = await storage.getPlaces();
      res.json(places);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get(api.places.get.path, async (req, res) => {
    try {
      const place = await storage.getPlace(Number(req.params.id));
      if (!place) return res.status(404).json({ message: "Place not found" });
      res.json(place);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/places/:id/stats", async (req, res) => {
    const placeId = Number(req.params.id);
    const dashboard = await storage.getBusinessDashboard(placeId);
    // Return only public stats
    res.json({
      checkins: dashboard.totalVisits,
      posts: dashboard.totalMoments,
      rating: dashboard.avgSurveyRating,
      rewards: dashboard.totalRewardsRedeemed // Maybe not needed but useful
    });
  });

  app.post("/api/checkins", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Validate input - assumes placeId is passed in body
      // We manually construct the checkin object since schema expects userId/placeId
      // and we want to take userId from session
      const { placeId } = req.body;
      if (!placeId) return res.status(400).json({ message: "placeId is required" });

      const checkin = await storage.createCheckin({
        userId: (req.user as any).id,
        placeId: Number(placeId)
      });
      res.status(201).json(checkin);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // === POSTS ===
  app.get(api.posts.list.path, async (req, res) => {
    try {
      const input = api.posts.list.input.parse({
        filter: req.query.filter,
        placeId: req.query.placeId,
        userId: req.query.userId ? parseInt(req.query.userId as string) : undefined
      });
      const posts = await storage.getPosts(input?.filter, input?.placeId, input?.userId);
      res.json(posts);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post(api.posts.create.path, async (req, res) => {
    try {
      const input = api.posts.create.input.parse(req.body);
      const post = await storage.createPost(input as any);
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.put(api.posts.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = Number(req.params.id);
      const post = await storage.getPost(id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      if (post.userId !== (req.user as any).id) return res.status(403).json({ message: "Forbidden" });

      const input = api.posts.update.input.parse(req.body);
      const updatedPost = await storage.updatePost(id, input as any);
      res.json(updatedPost);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.delete(api.posts.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = Number(req.params.id);
      const post = await storage.getPost(id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      if (post.userId !== (req.user as any).id) return res.status(403).json({ message: "Forbidden" });

      await storage.deletePost(id);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.post(api.posts.like.path, async (req, res) => {
    try {
      const postId = Number(req.params.id);
      const userId = 1; // Always "Me" for now

      const existing = await storage.getLike(userId, postId);
      if (existing) return res.json({ success: true, points: 0 }); // Already liked

      await storage.createLike({ userId, postId });
      res.json({ success: true, points: 1 });
    } catch (err) {
      res.status(404).json({ message: "Post not found" });
    }
  });

  // === COMMENTS ===
  app.get(api.comments.list.path, async (req, res) => {
    try {
      const comments = await storage.getComments(Number(req.params.postId));
      res.json(comments);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post(api.comments.create.path, async (req, res) => {
    try {
      const postId = Number(req.params.postId);
      const { text } = req.body;
      const comment = await storage.createComment({ postId, userId: 1, text });
      res.status(201).json(comment);
    } catch (err) {
      res.status(400).json({ message: "Error creating comment" });
    }
  });

  // === REWARDS ===
  app.get(api.rewards.list.path, async (req, res) => {
    try {
      const rewards = await storage.getRewards();
      res.json(rewards);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post(api.rewards.redeem.path, async (req, res) => {
    try {
      const rewardId = Number(req.params.id);
      const { type } = req.body;
      const userId = 1;
      await storage.redeemReward(userId, rewardId, type);
      const user = await storage.getUser(userId);
      res.json({ success: true, newPoints: user!.points });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get(api.rewards.history.path, async (req, res) => {
    try {
      const history = await storage.getRewardHistory(1);
      res.json(history);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // === WALLET & CASHOUTS ===
  app.get(api.wallet.transactions.path, async (req, res) => {
    try {
      const transactions = await storage.getTransactions(1);
      res.json(transactions);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get(api.wallet.cashouts.list.path, async (req, res) => {
    try {
      const cashouts = await storage.getCashouts(1);
      res.json(cashouts);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post(api.wallet.cashouts.create.path, async (req, res) => {
    try {
      const input = api.wallet.cashouts.create.input.parse(req.body);
      const cashout = await storage.createCashout({ ...input, userId: 1 });
      res.status(201).json(cashout);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  // === SURVEYS ===
  app.get(api.surveys.list.path, async (req, res) => {
    try {
      const s = await storage.getSurveys();
      res.json(s);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post(api.surveys.submit.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { answers } = req.body;
      await storage.submitSurveyResponse(1, id, answers);
      res.json({ success: true, points: 100 });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  // === DAILY TASKS ===
  app.get(api.dailyTasks.list.path, async (req, res) => {
    try {
      const t = await storage.getDailyTasks(1);
      res.json(t);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post(api.dailyTasks.complete.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.completeDailyTask(1, id);
      res.json({ success: true, points: 10 });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  // === NOTIFICATIONS ===
  app.get(api.notifications.list.path, async (req, res) => {
    try {
      const notifs = await storage.getNotifications(1);
      res.json(notifs);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // === STORIES ===
  app.get(api.stories.list.path, async (req, res) => {
    try {
      const stories = await storage.getStories();
      res.json(stories);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get(api.stories.user.path, async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const stories = await storage.getStoriesByUser(userId);
      res.json(stories);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post(api.stories.create.path, async (req, res) => {
    try {
      const input = api.stories.create.input.parse(req.body);
      const story = await storage.createStory(input);
      res.status(201).json(story);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  // === USERS UPDATE ===
  app.put(api.users.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.users.update.input.parse(req.body);

      // In a real app we would check if req.user.id === id
      const updatedUser = await storage.updateUser(id, input);
      res.json(updatedUser);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(404).json({ message: "User not found" });
    }
  });

  // === SIMULATION (DISABLED FOR REAL WORLD TESTING) ===
  // Every 15 seconds, inject a random like or comment on a random post
  /*
  setInterval(async () => {
    try {
      const allPosts = await storage.getPosts();
      if (allPosts.length === 0) return;
  
      const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
      const randomActorId = Math.floor(Math.random() * 4) + 2; // Users 2-5
  
      if (Math.random() > 0.5) {
        // Mock Like
        const existing = await storage.getLike(randomActorId, randomPost.id);
        if (!existing) {
          await storage.createLike({ userId: randomActorId, postId: randomPost.id });
          if (randomPost.userId === 1) {
            await storage.createNotification({
              userId: 1, type: "like", actorId: randomActorId,
              message: "Someone liked your moment!"
            });
          }
        }
      } else {
        // Mock Comment
        const texts = ["Love this!", "Where is this?", "So cool!", "Vibes ✨", "Need to go here."];
        const text = texts[Math.floor(Math.random() * texts.length)];
        await storage.createComment({ userId: randomActorId, postId: randomPost.id, text });
        if (randomPost.userId === 1) {
          await storage.createNotification({
            userId: 1, type: "comment", actorId: randomActorId,
            message: "Someone commented on your moment"
          });
        }
      }
    } catch (e) {
      console.error("Simulation error", e);
    }
  }, 15000);
  */

  // Cashout Status Simulation
  /*
  setInterval(async () => {
    try {
      const cashouts = await storage.getCashouts(1);
      const pending = cashouts.filter(c => c.status === "pending");
      if (pending.length > 0) {
        const target = pending[0];
        const nextStatus = Math.random() > 0.5 ? "approved" : "paid";
        await storage.updateCashoutStatus(target.id, nextStatus);
  
        await storage.createNotification({
          userId: 1,
          type: "reward",
          actorId: 1,
          message: `Your cashout request for ${target.amount} pts has been ${nextStatus}!`
        });
      }
    } catch (e) {
      console.error("Cashout simulation error", e);
    }
  }, 30000); // Check every 30 seconds
  */

  // Register business routes
  registerBusinessRoutes(app, storage);

  // Register admin routes
  registerAdminRoutes(app, storage);

  return httpServer;
}
