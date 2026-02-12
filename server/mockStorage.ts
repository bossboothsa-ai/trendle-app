import {
  users, places, posts, comments, likes, follows, rewards, userRewards, notifications, stories,
  surveys, surveyResponses, dailyTasks, userDailyTasks, pointsHistory, cashouts,
  type User, type Place, type Post, type Comment, type Like, type Follow, type Reward, type Notification, type Story,
  type Survey, type SurveyResponse, type DailyTask, type UserDailyTask, type UserReward, type PointsHistory, type Cashout
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { fictionalPlaces, mockUsers as seedUsers, mockPostsData, venueSurveys } from "./seedData";

// Mock data storage
let mockUsers: User[] = [];
let mockPlaces: Place[] = [];
let mockPosts: Post[] = [];
let mockComments: (Comment & { author: User })[] = [];
let mockLikes: Like[] = [];
let mockFollows: Follow[] = [];
let mockRewards: Reward[] = [];
let mockUserRewards: UserReward[] = [];
let mockNotifications: Notification[] = [];
let mockPointsHistory: PointsHistory[] = [];
let mockSurveys: Survey[] = [];
let mockSurveyResponses: SurveyResponse[] = [];
let mockDailyTasks: (DailyTask & { completed: boolean })[] = [];
let mockUserDailyTasks: UserDailyTask[] = [];
let mockCashouts: Cashout[] = [];

let userIdCounter = 1;
let placeIdCounter = 1;
let postIdCounter = 1;
let commentIdCounter = 1;
let likeIdCounter = 1;
let followIdCounter = 1;
let rewardIdCounter = 1;
let userRewardIdCounter = 1;
let notificationIdCounter = 1;
let surveyIdCounter = 1;
let surveyResponseIdCounter = 1;
let dailyTaskIdCounter = 1;
let userDailyTaskIdCounter = 1;
let pointsHistoryIdCounter = 1;
let storyIdCounter = 1;
let cashoutIdCounter = 1;

let mockStories: Story[] = [];

export interface IStorage {
  // Users
  getUser(id: number): Promise<(User & { hasFollowed: boolean }) | undefined>;
  getUsers(): Promise<(User & { hasFollowed: boolean })[]>;
  createUser(user: Partial<User>): Promise<User & { hasFollowed: boolean }>;
  updateUser(id: number, user: Partial<User>): Promise<User & { hasFollowed: boolean }>;
  updateUserPoints(id: number, points: number, reason?: string): Promise<User>;

  // Places
  getPlaces(): Promise<Place[]>;
  getPlace(id: number): Promise<Place | undefined>;
  createPlace(place: Partial<Place>): Promise<Place>;

  // Posts
  getPosts(filter?: string, placeId?: string, userId?: number): Promise<(Post & { author: User, place: Place | null, hasLiked: boolean, hasFollowed: boolean })[]>;
  createPost(post: Partial<Post>): Promise<Post>;
  getPost(id: number): Promise<Post | undefined>;

  // Rewards & Wallet
  getRewards(): Promise<Reward[]>;
  redeemReward(userId: number, rewardId: number, type: string): Promise<UserReward>;
  getRewardHistory(userId: number): Promise<(UserReward & { reward: Reward })[]>;
  getCashouts(userId: number): Promise<Cashout[]>;
  createCashout(cashout: Partial<Cashout>): Promise<Cashout>;
  updateCashoutStatus(id: number, status: string, reason?: string): Promise<Cashout>;
  getTransactions(userId: number): Promise<any[]>;

  // Interactions
  createLike(like: Partial<Like>): Promise<Like>;
  getLike(userId: number, postId: number): Promise<Like | undefined>;
  createComment(comment: Partial<Comment>): Promise<Comment>;
  getComments(postId: number): Promise<(Comment & { author: User })[]>;

  // Rewards
  getRewards(): Promise<Reward[]>;
  redeemReward(userId: number, rewardId: number, type: string): Promise<UserReward>;
  getRewardHistory(userId: number): Promise<(UserReward & { reward: Reward })[]>;

  // Surveys
  getSurveys(): Promise<Survey[]>;
  submitSurveyResponse(userId: number, surveyId: number, answers: any): Promise<SurveyResponse>;

  // Daily Tasks
  getDailyTasks(userId: number): Promise<(DailyTask & { completed: boolean })[]>;
  completeDailyTask(userId: number, taskId: number): Promise<UserDailyTask>;

  // Notifications
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notif: Partial<Notification>): Promise<Notification>;

  // Stories
  getStories(): Promise<(Story & { user: User })[]>;
  getStoriesByUser(userId: number): Promise<(Story & { user: User })[]>;
  createStory(story: Partial<Story>): Promise<Story>;

  // Discovery
  getSuggestedUsers(userId: number): Promise<User[]>;
  createFollow(followerId: number, followingId: number): Promise<Follow>;

  // History
  getPointsHistory(userId: number): Promise<PointsHistory[]>;
  getRedemptionHistory(userId: number): Promise<(UserReward & { reward: Reward })[]>;

  // Seed Helper
  seed(): Promise<void>;
}

export class MockStorage implements IStorage {
  async getUser(id: number): Promise<(User & { hasFollowed: boolean }) | undefined> {
    const user = mockUsers.find(u => u.id === id);
    if (!user) return undefined;
    return {
      ...user,
      hasFollowed: mockFollows.some(f => f.followerId === 1 && f.followingId === id)
    };
  }

  async getUsers(): Promise<(User & { hasFollowed: boolean })[]> {
    return mockUsers.map(u => ({
      ...u,
      hasFollowed: mockFollows.some(f => f.followerId === 1 && f.followingId === u.id)
    }));
  }

  async createUser(user: Partial<User>): Promise<User & { hasFollowed: boolean }> {
    const newUser: User = {
      id: userIdCounter++,
      username: user.username || `user${userIdCounter}`,
      displayName: user.displayName || user.username || `User ${userIdCounter}`,
      email: user.email || `${user.username || 'user'}@example.com`,
      avatar: user.avatar || `https://images.unsplash.com/photo-${Math.random() * 1000}?w=100`,
      level: user.level || "Silver",
      points: user.points || 0,
      bio: user.bio ?? null,
      location: user.location || null,
      interests: user.interests || [],
      isPrivate: user.isPrivate ?? false,
      notificationSettings: user.notificationSettings || {
        likes: true,
        comments: true,
        follows: true,
        rewards: true,
        places: true,
      },
      privacySettings: user.privacySettings || {
        showPoints: true,
        canSeeMoments: "everyone",
        canComment: "everyone",
      },
    };
    mockUsers.push(newUser);
    return { ...newUser, hasFollowed: false };
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User & { hasFollowed: boolean }> {
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error("User not found");

    Object.assign(user, updates);
    return {
      ...user,
      hasFollowed: mockFollows.some(f => f.followerId === 1 && f.followingId === id)
    };
  }

  async updateUserPoints(id: number, points: number, reason?: string): Promise<User> {
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error("User not found");

    const diff = points - user.points;
    user.points = points;
    user.level = points >= 1500 ? "Platinum" : points >= 500 ? "Gold" : "Silver";

    if (diff !== 0) {
      mockPointsHistory.push({
        id: pointsHistoryIdCounter++,
        userId: id,
        amount: diff,
        reason: reason || "Points update",
        createdAt: new Date(),
      });
    }

    return user;
  }

  async getPlaces(): Promise<Place[]> {
    return [...mockPlaces];
  }

  async getPlace(id: number): Promise<Place | undefined> {
    return mockPlaces.find(p => p.id === id);
  }

  async createPlace(place: Partial<Place>): Promise<Place> {
    const newPlace: Place = {
      id: placeIdCounter++,
      name: place.name || "Unknown Place",
      description: place.description ?? null,
      location: place.location || "Unknown Location",
      distance: place.distance || "0.0km",
      image: place.image || `https://images.unsplash.com/photo-${Math.random() * 1000}?w=500`,
      pointsPerVisit: place.pointsPerVisit || 50,
      activeOffers: place.activeOffers || 1,
      category: place.category || "General",
      tags: place.tags || [],
      gallery: place.gallery || [],
    };
    mockPlaces.push(newPlace);
    return newPlace;
  }

  async getPosts(filter?: string, placeId?: string, userId?: number): Promise<(Post & { author: User, place: Place | null, hasLiked: boolean, hasFollowed: boolean })[]> {
    let filteredPosts = [...mockPosts];
    const currentUser = mockUsers.find(u => u.id === 1);

    if (userId) {
      filteredPosts = filteredPosts.filter(p => p.userId === userId);
    } else if (placeId) {
      filteredPosts = filteredPosts.filter(p => p.placeId === parseInt(placeId));
    }

    if (filter === 'following') {
      const followedIds = mockFollows.filter(f => f.followerId === 1).map(f => f.followingId);
      filteredPosts = filteredPosts.filter(p => followedIds.includes(p.userId));
    } else if (filter === 'foryou') {
      const followedIds = mockFollows.filter(f => f.followerId === 1).map(f => f.followingId);
      const visitedPlaceIds = mockPosts.filter(p => p.userId === 1 && p.placeId).map(p => p.placeId!);
      const userInterests = currentUser?.interests || [];

      filteredPosts = filteredPosts.map(post => {
        let score = 0;
        if (followedIds.includes(post.userId)) score += 50;
        if (post.placeId && visitedPlaceIds.includes(post.placeId)) score += 30;

        const matchingTags = post.tags.filter(tag => userInterests.includes(tag));
        score += matchingTags.length * 10;

        const ageInDays = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        score -= ageInDays * 5;

        return { post, score };
      })
        .sort((a, b) => b.score - a.score)
        .map(item => item.post);
    }

    return filteredPosts.map(p => ({
      ...p,
      author: mockUsers.find(u => u.id === p.userId)!,
      place: mockPlaces.find(pl => pl.id === p.placeId) || null,
      hasLiked: mockLikes.some(l => l.userId === 1 && l.postId === p.id),
      hasFollowed: mockFollows.some(f => f.followerId === 1 && f.followingId === p.userId),
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPost(post: Partial<Post>): Promise<Post> {
    const newPost: Post = {
      id: postIdCounter++,
      userId: post.userId || 1,
      placeId: post.placeId ?? null,
      media: post.media || ((post as any).image ? [{ type: 'image', url: (post as any).image }] : []),
      caption: post.caption ?? null,
      tags: post.tags || [],
      likesCount: post.likesCount || 0,
      commentsCount: post.commentsCount || 0,
      createdAt: new Date(),
    };
    mockPosts.push(newPost);

    // Award points
    const user = await this.getUser(newPost.userId);
    if (user) {
      await this.updateUserPoints(user.id, user.points + 40 + (newPost.caption && newPost.caption.length > 20 ? 15 : 0));
    }

    return newPost;
  }

  async getPost(id: number): Promise<Post | undefined> {
    return mockPosts.find(p => p.id === id);
  }

  async createLike(like: Partial<Like>): Promise<Like> {
    const existingLike = mockLikes.find(l => l.userId === like.userId && l.postId === like.postId);
    if (existingLike) return existingLike;

    const newLike: Like = {
      id: likeIdCounter++,
      userId: like.userId || 1,
      postId: like.postId || 1,
    };
    mockLikes.push(newLike);

    // Increment post like count
    const post = mockPosts.find(p => p.id === newLike.postId);
    if (post) {
      post.likesCount++;
    }

    // Award point to liker
    const user = await this.getUser(newLike.userId);
    if (user) {
      await this.updateUserPoints(user.id, user.points + 1);
    }

    return newLike;
  }

  async getLike(userId: number, postId: number): Promise<Like | undefined> {
    return mockLikes.find(l => l.userId === userId && l.postId === postId);
  }

  async createComment(comment: Partial<Comment>): Promise<Comment> {
    const newComment: Comment = {
      id: commentIdCounter++,
      postId: comment.postId || 1,
      userId: comment.userId || 1,
      text: comment.text || "",
      createdAt: new Date(),
    };
    mockComments.push({
      ...newComment,
      author: mockUsers.find(u => u.id === newComment.userId)!,
    });

    // Increment post comment count
    const post = mockPosts.find(p => p.id === newComment.postId);
    if (post) {
      post.commentsCount++;
    }

    // Award point to commenter
    const user = await this.getUser(newComment.userId);
    if (user) {
      await this.updateUserPoints(user.id, user.points + 1);
    }

    return newComment;
  }

  async getComments(postId: number): Promise<(Comment & { author: User })[]> {
    return mockComments.filter(c => c.postId === postId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRewards(): Promise<Reward[]> {
    return [...mockRewards];
  }

  async redeemReward(userId: number, rewardId: number, type: string): Promise<UserReward> {
    const reward = mockRewards.find(r => r.id === rewardId);
    const user = mockUsers.find(u => u.id === userId);

    if (!reward || !user) throw new Error("Invalid reward or user");
    if (user.points < reward.cost) throw new Error("Not enough points");

    await this.updateUserPoints(userId, user.points - reward.cost);

    const newUserReward: UserReward = {
      id: userRewardIdCounter++,
      userId,
      rewardId,
      status: "pending",
      type,
      code: Math.random().toString(36).substring(2, 10).toUpperCase(),
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=trendle-reward",
      isUsed: false,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      redeemedAt: new Date(),
    };
    mockUserRewards.push(newUserReward);

    return newUserReward;
  }

  async getRewardHistory(userId: number): Promise<(UserReward & { reward: Reward })[]> {
    return mockUserRewards.filter(ur => ur.userId === userId).map(ur => ({
      ...ur,
      reward: mockRewards.find(r => r.id === ur.rewardId)!,
    })).sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime());
  }

  async getCashouts(userId: number): Promise<Cashout[]> {
    return mockCashouts.filter(c => c.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createCashout(cashout: Partial<Cashout>): Promise<Cashout> {
    const userId = cashout.userId || 1;
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    if (user.points < (cashout.amount || 0)) throw new Error("Not enough points");

    const newCashout: Cashout = {
      id: cashoutIdCounter++,
      userId,
      amount: cashout.amount || 0,
      status: "pending",
      type: cashout.type || "bank",
      details: cashout.details || {},
      reason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockCashouts.push(newCashout);
    await this.updateUserPoints(userId, user.points - newCashout.amount, "Cashout Request");

    return newCashout;
  }

  async updateCashoutStatus(id: number, status: string, reason?: string): Promise<Cashout> {
    const cashout = mockCashouts.find(c => c.id === id);
    if (!cashout) throw new Error("Cashout not found");

    cashout.status = status as any;
    if (reason) cashout.reason = reason;
    cashout.updatedAt = new Date();

    return cashout;
  }

  async getTransactions(userId: number): Promise<any[]> {
    const earnings = mockPointsHistory.filter(h => h.userId === userId && h.amount > 0).map(h => ({
      id: `earn-${h.id}`,
      type: 'earned',
      amount: h.amount,
      description: h.reason,
      status: 'completed',
      date: h.createdAt
    }));

    const redemptions = mockUserRewards.filter(r => r.userId === userId).map(r => {
      const reward = mockRewards.find(rew => rew.id === r.rewardId);
      return {
        id: `redeem-${r.id}`,
        type: 'redeemed',
        amount: reward?.cost || 0,
        description: reward?.title || 'Reward',
        status: r.status === 'settled' ? 'completed' : 'pending',
        date: r.redeemedAt
      };
    });

    const payouts = mockCashouts.filter(c => c.userId === userId).map(c => ({
      id: `payout-${c.id}`,
      type: 'cashout',
      amount: c.amount,
      description: `Cashout via ${c.type}`,
      status: c.status === 'paid' ? 'completed' : c.status,
      date: c.createdAt
    }));

    return [...earnings, ...redemptions, ...payouts].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getSurveys(): Promise<Survey[]> {
    return [...mockSurveys];
  }

  async submitSurveyResponse(userId: number, surveyId: number, answers: any): Promise<SurveyResponse> {
    const survey = mockSurveys.find(s => s.id === surveyId);
    if (!survey) throw new Error("Survey not found");

    const newSurveyResponse: SurveyResponse = {
      id: surveyResponseIdCounter++,
      userId,
      surveyId,
      answers,
      createdAt: new Date(),
    };
    mockSurveyResponses.push(newSurveyResponse);

    const user = await this.getUser(userId);
    if (user) {
      await this.updateUserPoints(userId, user.points + survey.points);
    }

    return newSurveyResponse;
  }

  async getDailyTasks(userId: number): Promise<(DailyTask & { completed: boolean })[]> {
    return mockDailyTasks.map(task => ({
      ...task,
      completed: mockUserDailyTasks.some(udt => udt.userId === userId && udt.taskId === task.id),
    }));
  }

  async completeDailyTask(userId: number, taskId: number): Promise<UserDailyTask> {
    const task = mockDailyTasks.find(t => t.id === taskId);
    if (!task) throw new Error("Task not found");

    const newUserDailyTask: UserDailyTask = {
      id: userDailyTaskIdCounter++,
      userId,
      taskId,
      completedAt: new Date(),
    };
    mockUserDailyTasks.push(newUserDailyTask);

    const user = await this.getUser(userId);
    if (user) {
      await this.updateUserPoints(userId, user.points + task.points);
    }

    return newUserDailyTask;
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    return mockNotifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNotification(notif: Partial<Notification>): Promise<Notification> {
    const newNotification: Notification = {
      id: notificationIdCounter++,
      userId: notif.userId || 1,
      type: notif.type || "like",
      actorId: notif.actorId || 1,
      message: notif.message || "Notification",
      read: false,
      createdAt: new Date(),
    };
    mockNotifications.push(newNotification);
    return newNotification;
  }

  async getStories(): Promise<(Story & { user: User })[]> {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return mockStories
      .filter(story => new Date(story.createdAt).getTime() > oneDayAgo)
      .map(story => ({
        ...story,
        user: mockUsers.find(u => u.id === story.userId)!
      })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getStoriesByUser(userId: number): Promise<(Story & { user: User })[]> {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return mockStories
      .filter(story => story.userId === userId && new Date(story.createdAt).getTime() > oneDayAgo)
      .map(story => ({
        ...story,
        user: mockUsers.find(u => u.id === story.userId)!
      })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createStory(story: Partial<Story>): Promise<Story> {
    const newStory: Story = {
      id: storyIdCounter++,
      userId: story.userId || 1,
      media: story.media || [],
      caption: story.caption ?? null,
      createdAt: new Date(),
    };
    mockStories.push(newStory);
    return newStory;
  }

  async getSuggestedUsers(userId: number): Promise<User[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    const followedIds = mockFollows.filter(f => f.followerId === userId).map(f => f.followingId);

    return mockUsers
      .filter(u => u.id !== userId && !followedIds.includes(u.id))
      .map(u => {
        const overlap = u.interests.filter(i => user.interests.includes(i));
        return { user: u, score: overlap.length };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.user);
  }

  async getFollow(followerId: number, followingId: number): Promise<Follow | undefined> {
    return mockFollows.find(f => f.followerId === followerId && f.followingId === followingId);
  }

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    mockFollows = mockFollows.filter(f => !(f.followerId === followerId && f.followingId === followingId));
  }

  async createFollow(followerId: number, followingId: number): Promise<Follow> {
    const existing = await this.getFollow(followerId, followingId);
    if (existing) return existing;

    const newFollow: Follow = {
      id: followIdCounter++,
      followerId,
      followingId,
    };
    mockFollows.push(newFollow);

    // Create notification for the user being followed
    await this.createNotification({
      userId: followingId,
      type: "follow",
      actorId: followerId,
      message: `${mockUsers.find(u => u.id === followerId)?.username || 'Someone'} started following you`,
    });

    return newFollow;
  }

  async getPointsHistory(userId: number): Promise<PointsHistory[]> {
    return mockPointsHistory
      .filter(h => h.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRedemptionHistory(userId: number): Promise<(UserReward & { reward: Reward })[]> {
    return mockUserRewards
      .filter(ur => ur.userId === userId)
      .map(ur => ({
        ...ur,
        reward: mockRewards.find(r => r.id === ur.rewardId)!,
      }))
      .sort((a, b) => b.redeemedAt.getTime() - a.redeemedAt.getTime());
  }

  async seed(): Promise<void> {
    if (mockUsers.length > 0) return;

    console.log("Seeding mock database...");

    // 1. Users
    for (const u of seedUsers) await this.createUser(u);

    // 2. Places 
    for (const p of fictionalPlaces) await this.createPlace(p);

    // 3. Posts
    for (const p of mockPostsData) await this.createPost(p as any);

    // 4. Rewards
    const rewardsData = [
      { id: 0, title: "Free Coffee", description: "Redeem for any standard coffee at Lunar Lounge", cost: 500, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200", locked: false, category: "product" },
      { id: 0, title: "Half Price Pizza", description: "50% off any large pizza at Slice of Heaven", cost: 800, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200", locked: false, category: "discount" },
      { id: 0, title: "R100 Airtime", description: "Mobile top-up for any network", cost: 1000, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200", locked: false, category: "airtime" },
      { id: 0, title: "VIP Night Out", description: "VIP entry + 1 drink at Neon Bean", cost: 2500, image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?w=200", locked: true, category: "experience" },
      { id: 0, title: "R250 Cash Payout", description: "Transfer to your bank or mobile wallet", cost: 2500, image: "https://images.unsplash.com/photo-1554030226-e41712133489?w=200", locked: true, category: "cashout" }
    ];

    for (const r of rewardsData) {
      mockRewards.push({ ...r, id: rewardIdCounter++ });
    }

    // 5. Surveys & Tasks
    for (const s of venueSurveys) {
      mockSurveys.push({
        ...s,
        id: surveyIdCounter++,
      });
    }

    mockDailyTasks.push({
      id: dailyTaskIdCounter++,
      title: "Morning Check-in",
      description: "Open the app before 10 AM",
      points: 10,
      type: "check-in",
      completed: false,
    });

    // 6. Stories (Last 24 hours)
    for (const user of mockUsers.slice(1, 8)) {
      const place = fictionalPlaces[Math.floor(Math.random() * fictionalPlaces.length)];
      const randomTime = new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000));

      mockStories.push({
        id: storyIdCounter++,
        userId: user.id || 1, // Ensure fallback to 1 if id is missing in mockUsers loop
        media: [{ type: 'image', url: place.image }],
        caption: "Having a blast here! ✨",
        createdAt: randomTime,
      });
    }

    // 7. Notifications
    await this.createNotification({ userId: 1, type: "like", actorId: 2, message: "Jessica liked your photo" });
    await this.createNotification({ userId: 1, type: "follow", actorId: 3, message: "Mike started following you" });
  }
}

export const storage = new MockStorage();
