import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Seed data on startup
  await storage.seed();

  // === USERS ===
  app.get(api.users.list.path, async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.get(api.users.get.path, async (req, res) => {
    const user = await storage.getUser(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  app.get(api.users.me.path, async (req, res) => {
    // Hardcoded "Me" for mock purposes
    const me = await storage.getUser(1); 
    res.json(me);
  });

  // === PLACES ===
  app.get(api.places.list.path, async (req, res) => {
    const places = await storage.getPlaces();
    res.json(places);
  });

  app.get(api.places.get.path, async (req, res) => {
    const place = await storage.getPlace(Number(req.params.id));
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  });

  // === POSTS ===
  app.get(api.posts.list.path, async (req, res) => {
    const { filter, placeId } = req.query;
    // In a real app we'd use filter to show 'following' only
    const posts = await storage.getPosts(filter as string, placeId as string);
    res.json(posts);
  });

  app.post(api.posts.create.path, async (req, res) => {
    try {
      const input = api.posts.create.input.parse(req.body);
      const post = await storage.createPost(input);
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
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
    const comments = await storage.getComments(Number(req.params.postId));
    res.json(comments);
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
    const rewards = await storage.getRewards();
    res.json(rewards);
  });

  app.post(api.rewards.redeem.path, async (req, res) => {
    try {
      const rewardId = Number(req.params.id);
      const userId = 1;
      await storage.redeemReward(userId, rewardId);
      const user = await storage.getUser(userId);
      res.json({ success: true, newPoints: user!.points });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  // === NOTIFICATIONS ===
  app.get(api.notifications.list.path, async (req, res) => {
    const notifs = await storage.getNotifications(1);
    res.json(notifs);
  });

  // === SIMULATION (Live Feel) ===
  // Every 15 seconds, inject a random like or comment on a random post
  setInterval(async () => {
    try {
      const allPosts = await storage.getPosts();
      if (allPosts.length === 0) return;
      
      const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
      const randomActorId = Math.floor(Math.random() * 4) + 2; // Users 2-5
      
      if (Math.random() > 0.5) {
        // Mock Like
        // We don't want to actually spam the DB with duplicate likes if they exist, 
        // but for simulation visual effect we just want to update the count usually.
        // But let's be clean:
        const existing = await storage.getLike(randomActorId, randomPost.id);
        if (!existing) {
          await storage.createLike({ userId: randomActorId, postId: randomPost.id });
          // If it's MY post, notify me
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

  return httpServer;
}
