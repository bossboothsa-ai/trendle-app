import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DEMO_USERS, DEMO_BUSINESSES, DEMO_POSTS, DEMO_NOTIFICATIONS } from "@/lib/demo-data";

// ============================================
// USERS & PROFILE
// ============================================

// DEV MODE MOCK DATA
const DEV_USER = {
  id: 1,
  username: "dev_superuser",
  displayName: "Dev Admin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
  level: "Platinum",
  points: 1000,
  bio: "Superuser Account",
  location: "Cape Town",
  publicActivityId: "TRND-DEV001",
  hasFollowed: false,
  email: "dev@trendle.com",
  notificationSettings: { likes: true, comments: true, follows: true },
  privacySettings: { showPoints: true, canSeeMoments: "everyone", canComment: "everyone" },
  isPrivate: false,
  interests: ["coding", "coffee"]
};

export function useUser(id?: number) {
  // If no ID provided, we could use a 'me' endpoint or handle logic differently
  // The backend route is /api/users/:id or /api/me
  const path = id ? buildUrl(api.users.get.path, { id }) : api.users.me.path;
  const key = id ? [api.users.get.path, id] : [api.users.me.path];

  const isDemoMode = localStorage.getItem("TRENDLE_DEMO_MODE") === "true";

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      if (isDemoMode) return DEMO_USERS[0];
      const res = await apiRequest("GET", path);
      return (id ? api.users.get.responses[200] : api.users.me.responses[200]).parse(await res.json());
    },
  });
}

export function useCurrentUser() {
  return useUser();
}

// ============================================
// PLACES (EXPLORE)
// ============================================

export function usePlaces() {
  const isDemoMode = localStorage.getItem("TRENDLE_DEMO_MODE") === "true";
  return useQuery({
    queryKey: [api.places.list.path],
    queryFn: async () => {
      if (isDemoMode) return DEMO_BUSINESSES;
      const res = await apiRequest("GET", api.places.list.path);
      return api.places.list.responses[200].parse(await res.json());
    },
  });
}

export function usePlace(id: number) {
  return useQuery({
    queryKey: [api.places.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.places.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch place");
      return api.places.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// ============================================
// POSTS (FEED)
// ============================================

export function usePosts(filter?: 'all' | 'following' | 'foryou', placeId?: string, userId?: number) {
  const isDemoMode = localStorage.getItem("TRENDLE_DEMO_MODE") === "true";
  return useQuery({
    queryKey: [api.posts.list.path, { filter, placeId, userId }],
    queryFn: async () => {
      if (isDemoMode) return DEMO_POSTS;

      // Build query params
      const params = new URLSearchParams();
      if (filter) params.append("filter", filter);
      if (placeId) params.append("placeId", placeId);
      if (userId) params.append("userId", userId.toString());

      const url = `${api.posts.list.path}?${params.toString()}`;
      const res = await apiRequest("GET", url);
      return api.posts.list.responses[200].parse(await res.json());
    },
    refetchInterval: isDemoMode ? false : 15000,
  });
}


export function useSuggestedUsers() {
  const isDemoMode = localStorage.getItem("TRENDLE_DEMO_MODE") === "true";
  return useQuery({
    queryKey: [api.users.suggested.path],
    queryFn: async () => {
      if (isDemoMode) return DEMO_USERS.slice(1, 6);
      const res = await apiRequest("GET", api.users.suggested.path);
      return api.users.suggested.responses[200].parse(await res.json());
    }
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: number) => {
      const url = buildUrl(api.users.follow.path, { id: userId });
      const res = await fetch(url, { method: api.users.follow.method });
      if (!res.ok) throw new Error("Failed to follow user");
      return api.users.follow.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.users.suggested.path] });
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
      toast({
        title: "Following",
        description: "You've successfully followed this user.",
        className: "bg-primary text-white border-none",
      });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: number) => {
      const url = buildUrl(api.users.unfollow.path, { id: userId });
      const res = await fetch(url, { method: api.users.unfollow.method });
      if (!res.ok) throw new Error("Failed to unfollow user");
      return api.users.unfollow.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.users.suggested.path] });
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
      toast({
        title: "Unfollowed",
        description: "You've stopped following this user.",
      });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      // data should match insertPostSchema
      const validated = api.posts.create.input.parse(data);
      const res = await fetch(api.posts.create.path, {
        method: api.posts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to create post");
      return api.posts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
      toast({
        title: "Posted!",
        description: "Your moment has been shared.",
        className: "bg-primary text-white border-none",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not share your post.",
        variant: "destructive",
      });
    }
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const url = buildUrl(api.posts.update.path, { id });
      const res = await fetch(url, {
        method: api.posts.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update post");
      return api.posts.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
      toast({
        title: "Post Updated",
        description: "Your changes have been saved.",
        className: "bg-primary text-white border-none",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    }
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.posts.delete.path, { id });
      const res = await fetch(url, { method: api.posts.delete.method });
      if (!res.ok) throw new Error("Failed to delete post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
      toast({
        title: "Post Deleted",
        description: "Your post has been removed.",
        className: "bg-destructive text-white border-none",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
    }
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postId: number) => {
      const url = buildUrl(api.posts.like.path, { id: postId });
      const res = await fetch(url, { method: api.posts.like.method });
      if (!res.ok) throw new Error("Failed to like post");
      return api.posts.like.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Optimistic update would be better, but standard invalidation for now
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
      // Show points earned if any
      if (data.points > 0) {
        toast({
          title: `+${data.points} Points!`,
          className: "bg-accent text-white border-none font-bold",
          duration: 1500,
        });
      }
    },
  });
}

// ============================================
// REWARDS
// ============================================

export function useRewards() {
  const isDemoMode = localStorage.getItem("TRENDLE_DEMO_MODE") === "true";
  return useQuery({
    queryKey: [api.rewards.list.path],
    queryFn: async () => {
      if (isDemoMode) return DEMO_BUSINESSES[0].activeRewards;
      const res = await apiRequest("GET", api.rewards.list.path);
      return api.rewards.list.responses[200].parse(await res.json());
    },
  });
}

export function useRedeemReward() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rewardId: number) => {
      const url = buildUrl(api.rewards.redeem.path, { id: rewardId });
      const res = await fetch(url, { method: api.rewards.redeem.method });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to redeem");
      }
      return api.rewards.redeem.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.rewards.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.users.me.path] }); // Update user points
      toast({
        title: "Reward Redeemed!",
        description: "Check your email for the voucher code.",
        className: "bg-green-500 text-white border-none",
      });
    },
    onError: (err) => {
      toast({
        title: "Redemption Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  });
}

// ============================================
// NOTIFICATIONS
// ============================================

export function useNotifications() {
  return useQuery({
    queryKey: [api.notifications.list.path],
    queryFn: async () => {
      const res = await fetch(api.notifications.list.path);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return api.notifications.list.responses[200].parse(await res.json());
    },
    refetchInterval: 10000,
  });
}

// ============================================
// COMMENTS
// ============================================

export function useComments(postId: number) {
  return useQuery({
    queryKey: [api.comments.list.path, postId],
    queryFn: async () => {
      const url = buildUrl(api.comments.list.path, { postId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return api.comments.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, text }: { postId: number; text: string }) => {
      const url = buildUrl(api.comments.create.path, { postId });
      const res = await fetch(url, {
        method: api.comments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to create comment");
      return api.comments.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.comments.list.path, variables.postId] });
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
      toast({
        title: "Comment posted!",
        description: "Your comment has been added.",
        className: "bg-primary text-white border-none",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not post your comment.",
        variant: "destructive",
      });
    }
  });
}

// ============================================
// SURVEYS
// ============================================

export function useSurveys() {
  const isDemoMode = localStorage.getItem("TRENDLE_DEMO_MODE") === "true";
  return useQuery({
    queryKey: [api.surveys.list.path],
    queryFn: async () => {
      if (isDemoMode) return DEMO_BUSINESSES[0].surveys;
      const res = await apiRequest("GET", api.surveys.list.path);
      return api.surveys.list.responses[200].parse(await res.json());
    },
  });
}

export function useSubmitSurvey() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, answers }: { id: number; answers: any }) => {
      const url = buildUrl(api.surveys.submit.path, { id });
      const res = await fetch(url, {
        method: api.surveys.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit survey");
      }
      return api.surveys.submit.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.surveys.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.users.me.path] });
      toast({
        title: `+${data.points} Points!`,
        description: "Survey completed successfully!",
        className: "bg-accent text-white border-none font-bold",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  });
}

// ============================================
// DAILY TASKS
// ============================================

export function useDailyTasks() {
  return useQuery({
    queryKey: [api.dailyTasks.list.path],
    queryFn: async () => {
      // DEV MODE MOCK
      if (process.env.NODE_ENV === "development") {
        return [
          {
            id: 1,
            title: "Coffee Check-in",
            description: "Check in at a Coffee Shop",
            points: 50,
            completed: false,
            type: "checkin",
            placeId: null,
            active: true,
            startDate: null,
            endDate: null,
            maxParticipants: null,
            verificationMethod: "QR Verified"
          },
          {
            id: 2,
            title: "Share Moment",
            description: "Post a Moment",
            points: 40,
            completed: true,
            type: "post",
            placeId: null,
            active: true,
            startDate: null,
            endDate: null,
            maxParticipants: null,
            verificationMethod: "QR Verified"
          }
        ];
      }
      const res = await fetch(api.dailyTasks.list.path);
      if (!res.ok) throw new Error("Failed to fetch daily tasks");
      return api.dailyTasks.list.responses[200].parse(await res.json());
    },
  });
}

export function useCompleteDailyTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (taskId: number) => {
      const url = buildUrl(api.dailyTasks.complete.path, { id: taskId });
      const res = await fetch(url, { method: api.dailyTasks.complete.method });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to complete task");
      }
      return api.dailyTasks.complete.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.dailyTasks.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.users.me.path] });
      toast({
        title: `+${data.points} Points!`,
        description: "Task completed!",
        className: "bg-accent text-white border-none font-bold",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  });
}

// ============================================
// STORIES
// ============================================

export function useStories() {
  return useQuery({
    queryKey: [api.stories.list.path],
    queryFn: async () => {
      // DEV MODE MOCK
      if (process.env.NODE_ENV === "development") {
        return [
          {
            id: 1,
            userId: 1,
            user: DEV_USER,
            media: [{ type: 'image', url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80" }],
            createdAt: new Date().toISOString(),
            caption: "My story caption"
          }
        ];
      }
      const res = await fetch(api.stories.list.path);
      if (!res.ok) throw new Error("Failed to fetch stories");
      return api.stories.list.responses[200].parse(await res.json());
    },
  });
}

export function useUserStories(userId: number) {
  return useQuery({
    queryKey: [api.stories.user.path, userId],
    queryFn: async () => {
      const url = buildUrl(api.stories.user.path, { userId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch user stories");
      return api.stories.user.responses[200].parse(await res.json());
    },
    enabled: !!userId,
  });
}

// (useCreatePost, useUpdatePost, useDeletePost removed from here)

export function useCreateStory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.stories.create.path, {
        method: api.stories.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create story");
      return api.stories.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.stories.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stories.user.path] });
      toast({
        title: "Story Added",
        description: "Your story is now live.",
        className: "bg-primary text-white border-none",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not add story.",
        variant: "destructive",
      });
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const url = buildUrl(api.users.update.path, { id });
      const res = await fetch(url, {
        method: api.users.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return api.users.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.users.me.path] });
      queryClient.invalidateQueries({ queryKey: [api.users.get.path] });
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved.",
        className: "bg-primary text-white border-none",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  });
}

export function usePointsHistory() {
  return useQuery({
    queryKey: [api.users.pointsHistory.path],
    queryFn: async () => {
      // DEV MODE MOCK
      if (process.env.NODE_ENV === "development") {
        return [
          { id: 1, userId: 1, amount: 50, reason: "Check-in at Truth Coffee", createdAt: new Date().toISOString() },
          { id: 2, userId: 1, amount: 10, reason: "Daily login", createdAt: new Date(Date.now() - 86400000).toISOString() }
        ];
      }
      const res = await fetch(api.users.pointsHistory.path);
      if (!res.ok) throw new Error("Failed to fetch points history");
      return api.users.pointsHistory.responses[200].parse(await res.json());
    },
  });
}

export function useRedemptionHistory() {
  return useQuery({
    queryKey: [api.users.redemptionHistory.path],
    queryFn: async () => {
      // DEV MODE MOCK
      if (process.env.NODE_ENV === "development") {
        return [
          {
            id: 1,
            userId: 1,
            rewardId: 1,
            pointsCost: 500,
            redeemedAt: new Date().toISOString(),
            reward: { title: "Test Reward", description: "Free Coffee" }
          }
        ];
      }
      const res = await fetch(api.users.redemptionHistory.path);
      if (!res.ok) throw new Error("Failed to fetch redemption history");
      return api.users.redemptionHistory.responses[200].parse(await res.json());
    },
  });
}

// ============================================
// WALLET & CASHOUTS
// ============================================

export function useTransactions() {
  return useQuery({
    queryKey: [api.wallet.transactions.path],
    queryFn: async () => {
      const res = await fetch(api.wallet.transactions.path);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return api.wallet.transactions.responses[200].parse(await res.json());
    },
    refetchInterval: 10000,
  });
}

export function useCashouts() {
  return useQuery({
    queryKey: [api.wallet.cashouts.list.path],
    queryFn: async () => {
      const res = await fetch(api.wallet.cashouts.list.path);
      if (!res.ok) throw new Error("Failed to fetch cashouts");
      return api.wallet.cashouts.list.responses[200].parse(await res.json());
    },
    refetchInterval: 15000,
  });
}

export function useRequestCashout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { amount: number; type: 'bank' | 'mobile' | 'airtime'; details: any }) => {
      const res = await fetch(api.wallet.cashouts.create.path, {
        method: api.wallet.cashouts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to request cashout");
      }
      return api.wallet.cashouts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.wallet.cashouts.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.wallet.transactions.path] });
      queryClient.invalidateQueries({ queryKey: [api.users.me.path] });
      toast({
        title: "Cashout Requested",
        description: "Your payout is being processed.",
        className: "bg-primary text-white border-none",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Cashout Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  });
}
