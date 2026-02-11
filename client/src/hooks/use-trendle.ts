import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// ============================================
// USERS & PROFILE
// ============================================

export function useUser(id?: number) {
  // If no ID provided, we could use a 'me' endpoint or handle logic differently
  // The backend route is /api/users/:id or /api/me
  const path = id ? buildUrl(api.users.get.path, { id }) : api.users.me.path;
  const key = id ? [api.users.get.path, id] : [api.users.me.path];

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await fetch(path);
      if (!res.ok) throw new Error("Failed to fetch user");
      return (id ? api.users.get.responses[200] : api.users.me.responses[200]).parse(await res.json());
    },
  });
}

// ============================================
// PLACES (EXPLORE)
// ============================================

export function usePlaces() {
  return useQuery({
    queryKey: [api.places.list.path],
    queryFn: async () => {
      const res = await fetch(api.places.list.path);
      if (!res.ok) throw new Error("Failed to fetch places");
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

export function usePosts(filter?: 'all' | 'following', placeId?: string) {
  return useQuery({
    queryKey: [api.posts.list.path, { filter, placeId }],
    queryFn: async () => {
      // Build query params
      const params = new URLSearchParams();
      if (filter) params.append("filter", filter);
      if (placeId) params.append("placeId", placeId);
      
      const url = `${api.posts.list.path}?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return api.posts.list.responses[200].parse(await res.json());
    },
    refetchInterval: 15000, // Polling for simulated realtime activity
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
  return useQuery({
    queryKey: [api.rewards.list.path],
    queryFn: async () => {
      const res = await fetch(api.rewards.list.path);
      if (!res.ok) throw new Error("Failed to fetch rewards");
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
