import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

import {
  DEMO_USERS,
  DEMO_BUSINESSES,
  DEMO_POSTS,
  DEMO_NOTIFICATIONS,
  DEMO_STORIES,
  DEMO_COMMENTS,
  DEMO_WALKTHROUGH,
  DEMO_TRANSACTIONS,
  DEMO_CASHOUTS,
  isInDemoMode
} from "./demo-data";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  if (isInDemoMode()) {
    console.log(`[DEMO MODE] Intercepting ${method} ${url}`);

    let responseData: any = null;
    const cleanUrl = url.split('?')[0];

    if (cleanUrl.endsWith("/api/users/me")) responseData = DEMO_USERS[0];
    else if (cleanUrl.includes("/api/users/suggested")) responseData = DEMO_USERS.slice(1, 4);
    else if (cleanUrl.includes("/api/users/")) {
      const id = parseInt(cleanUrl.split("/").pop() || "0");
      responseData = DEMO_USERS.find(u => u.id === id) || DEMO_USERS[0];
    }
    else if (cleanUrl.includes("/api/posts/")) {
      const id = parseInt(cleanUrl.split("/").pop() || "0");
      responseData = DEMO_POSTS.find(p => p.id === id) || DEMO_POSTS[0];
    }
    else if (cleanUrl.endsWith("/api/posts")) responseData = DEMO_POSTS;
    else if (cleanUrl.includes("/api/places/")) {
      const parts = cleanUrl.split("/");
      const id = parseInt(parts[parts.length - 1] || "0") || parseInt(parts[parts.length - 2] || "0");
      responseData = DEMO_BUSINESSES.find(b => b.id === id) || DEMO_BUSINESSES[0];
    }
    else if (cleanUrl.includes("/api/places")) responseData = DEMO_BUSINESSES;
    else if (cleanUrl.includes("/api/notifications")) responseData = DEMO_NOTIFICATIONS;
    else if (cleanUrl.includes("/api/stories")) responseData = DEMO_STORIES;
    else if (cleanUrl.includes("/comments")) {
      const postId = parseInt(cleanUrl.split("/api/posts/")[1]?.split("/")[0] || "601");
      responseData = DEMO_COMMENTS(postId);
    }
    else if (cleanUrl.includes("/api/points/history")) responseData = DEMO_WALKTHROUGH.wallet.history;
    else if (cleanUrl.includes("/api/points/redemptions")) responseData = DEMO_WALKTHROUGH.wallet.redemptions;
    else if (cleanUrl.includes("/api/rewards")) {
      const searchParams = new URLSearchParams(url.split('?')[1]);
      const placeIdStr = searchParams.get("placeId");
      if (placeIdStr) {
        const placeId = parseInt(placeIdStr);
        responseData = DEMO_BUSINESSES.find(b => b.id === placeId)?.activeRewards || [];
      } else {
        // Global Rewards Vault - show ALL rewards
        responseData = DEMO_BUSINESSES.flatMap(b => b.activeRewards);
      }
    }
    else if (cleanUrl.includes("/api/surveys")) {
      const placeId = parseInt(new URLSearchParams(url.split('?')[1]).get("placeId") || "1");
      responseData = DEMO_BUSINESSES.find(b => b.id === placeId)?.surveys || DEMO_BUSINESSES[0].surveys;
    }
    else if (cleanUrl.includes("/api/daily-tasks")) {
      const placeId = parseInt(new URLSearchParams(url.split('?')[1]).get("placeId") || "1");
      responseData = DEMO_BUSINESSES.find(b => b.id === placeId)?.tasks || DEMO_BUSINESSES[0].tasks;
    }
    else if (cleanUrl.includes("/api/wallet/transactions")) responseData = DEMO_TRANSACTIONS;
    else if (cleanUrl.includes("/api/wallet/cashouts")) responseData = DEMO_CASHOUTS;
    else if (cleanUrl.includes("/api/users/me/points-history")) responseData = DEMO_TRANSACTIONS;
    else if (cleanUrl.includes("/api/users/me/redemptions")) responseData = DEMO_WALKTHROUGH.wallet.redemptions;
    else if (cleanUrl.includes("/api/rewards/history")) responseData = DEMO_WALKTHROUGH.wallet.redemptions;
    else if (cleanUrl.includes("/api/host/applications")) {
      if (cleanUrl.endsWith("/api/host/applications")) {
        // Return all host applications from demo users
        responseData = [
          {
            id: 101,
            username: "demo_user",
            displayName: "Alexander Thorne",
            email: "alex@example.com",
            hostName: "Alex's Events",
            hostBio: "Hosting unique experiences in Cape Town's most vibrant venues",
            hostCategories: ["Social", "Networking", "Nightlife"],
            hostApplicationStatus: "approved",
            hostApplicationDate: new Date("2024-02-14"),
            hostMembershipTier: "active",
            paymentReference: "TRND-HOST-101",
            proofOfPayment: "https://example.com/payment/101",
            paymentVerified: true,
            paymentDate: new Date("2024-02-14")
          },
          {
            id: 102,
            username: "Alex_Creative",
            displayName: "Alex Creative",
            email: "alex.creative@example.com",
            hostName: "Creative Events",
            hostBio: "Creative workshops and art events for everyone",
            hostCategories: ["Art", "Workshops"],
            hostApplicationStatus: "pending",
            hostApplicationDate: new Date("2024-02-20"),
            hostMembershipTier: "starter",
            paymentReference: "TRND-HOST-102",
            proofOfPayment: "https://example.com/payment/102",
            paymentVerified: true,
            paymentDate: new Date("2024-02-20")
          },
          {
            id: 103,
            username: "Sarah_Wellness",
            displayName: "Sarah Wellness",
            email: "sarah.wellness@example.com",
            hostName: "Wellness Events",
            hostBio: "Yoga, meditation, and wellness workshops",
            hostCategories: ["Wellness", "Health"],
            hostApplicationStatus: "rejected",
            hostApplicationDate: new Date("2024-02-18"),
            hostMembershipTier: "active",
            paymentReference: "TRND-HOST-103",
            proofOfPayment: "https://example.com/payment/103",
            paymentVerified: false,
            paymentDate: new Date("2024-02-18")
          }
        ];
      } else if (cleanUrl.includes("/approve")) {
        const id = parseInt(cleanUrl.split("/").reverse()[1]);
        responseData = { success: true, message: `Application ${id} approved` };
      } else if (cleanUrl.includes("/reject")) {
        const id = parseInt(cleanUrl.split("/").reverse()[1]);
        responseData = { success: true, message: `Application ${id} rejected` };
      } else if (cleanUrl.includes("/request-correction")) {
        const id = parseInt(cleanUrl.split("/").reverse()[1]);
        responseData = { success: true, message: `Correction requested for application ${id}` };
      } else if (cleanUrl.includes("/api/host/applications/")) {
        const id = parseInt(cleanUrl.split("/").pop() || "0");
        responseData = [
          {
            id: 101,
            username: "demo_user",
            displayName: "Alexander Thorne",
            email: "alex@example.com",
            hostName: "Alex's Events",
            hostBio: "Hosting unique experiences in Cape Town's most vibrant venues",
            hostCategories: ["Social", "Networking", "Nightlife"],
            hostApplicationStatus: "approved",
            hostApplicationDate: new Date("2024-02-14"),
            hostMembershipTier: "active",
            paymentReference: "TRND-HOST-101",
            proofOfPayment: "https://example.com/payment/101",
            paymentVerified: true,
            paymentDate: new Date("2024-02-14")
          },
          {
            id: 102,
            username: "Alex_Creative",
            displayName: "Alex Creative",
            email: "alex.creative@example.com",
            hostName: "Creative Events",
            hostBio: "Creative workshops and art events for everyone",
            hostCategories: ["Art", "Workshops"],
            hostApplicationStatus: "pending",
            hostApplicationDate: new Date("2024-02-20"),
            hostMembershipTier: "starter",
            paymentReference: "TRND-HOST-102",
            proofOfPayment: "https://example.com/payment/102",
            paymentVerified: true,
            paymentDate: new Date("2024-02-20")
          },
          {
            id: 103,
            username: "Sarah_Wellness",
            displayName: "Sarah Wellness",
            email: "sarah.wellness@example.com",
            hostName: "Wellness Events",
            hostBio: "Yoga, meditation, and wellness workshops",
            hostCategories: ["Wellness", "Health"],
            hostApplicationStatus: "rejected",
            hostApplicationDate: new Date("2024-02-18"),
            hostMembershipTier: "active",
            paymentReference: "TRND-HOST-103",
            proofOfPayment: "https://example.com/payment/103",
            paymentVerified: false,
            paymentDate: new Date("2024-02-18")
          }
        ].find(app => app.id === id) || null;
      } else {
        responseData = { success: true, message: "Application submitted successfully" };
      }
    }
    else if (cleanUrl.includes("/api/host/plans")) {
      responseData = {
        starter: { name: "Starter Host", price: 49.99, maxEvents: 15, description: "Up to 15 events per month" },
        active: { name: "Active Host", price: 79.99, maxEvents: 30, description: "Up to 30 events per month" },
        pro: { name: "Pro Host", price: 99.99, maxEvents: Infinity, description: "Unlimited events" }
      };
    }
    else if (cleanUrl.includes("/api/host/membership")) {
      responseData = {
        tier: "active",
        status: "active",
        startDate: new Date("2024-02-15"),
        endDate: new Date("2024-03-15"),
        maxEvents: 30,
        usedEvents: 5
      };
    }

    // Default success for mutations
    if (!responseData && method !== "GET") {
      responseData = { success: true, message: "Action simulated successfully" };
    }

    return new Response(JSON.stringify(responseData || {}), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const url = queryKey.join("/") as string;
      if (isInDemoMode() && url.startsWith("/api")) {
        console.log(`[DEMO MODE] Intercepting GET ${url}`);

        let responseData: any = null;
        const cleanUrl = url.split('?')[0];

        if (cleanUrl.endsWith("/api/users/me")) responseData = DEMO_USERS[0];
        else if (cleanUrl.includes("/api/users/suggested")) responseData = DEMO_USERS.slice(1, 4);
        else if (cleanUrl.includes("/api/users/")) {
          const id = parseInt(cleanUrl.split("/").pop() || "0");
          responseData = DEMO_USERS.find(u => u.id === id) || DEMO_USERS[0];
        }
        else if (cleanUrl.includes("/api/posts/")) {
          const id = parseInt(cleanUrl.split("/").pop() || "0");
          responseData = DEMO_POSTS.find(p => p.id === id) || DEMO_POSTS[0];
        }
        else if (cleanUrl.endsWith("/api/posts")) responseData = DEMO_POSTS;
        else if (cleanUrl.includes("/api/places/")) {
          const parts = cleanUrl.split("/");
          const id = parseInt(parts[parts.length - 1] || "0") || parseInt(parts[parts.length - 2] || "0");
          responseData = DEMO_BUSINESSES.find(b => b.id === id) || DEMO_BUSINESSES[0];
        }
        else if (cleanUrl.includes("/api/places")) responseData = DEMO_BUSINESSES;
        else if (cleanUrl.includes("/api/notifications")) responseData = DEMO_NOTIFICATIONS;
        else if (cleanUrl.includes("/api/stories")) responseData = DEMO_STORIES;
        else if (cleanUrl.includes("/comments")) {
          const postId = parseInt(cleanUrl.split("/api/posts/")[1]?.split("/")[0] || "601");
          responseData = DEMO_COMMENTS(postId);
        }
        else if (cleanUrl.includes("/api/points/history")) responseData = DEMO_WALKTHROUGH.wallet.history;
        else if (cleanUrl.includes("/api/points/redemptions")) responseData = DEMO_WALKTHROUGH.wallet.redemptions;
        else if (cleanUrl.includes("/api/rewards")) {
          const searchParams = new URLSearchParams(url.split('?')[1]);
          const placeIdStr = searchParams.get("placeId");
          if (placeIdStr) {
            const placeId = parseInt(placeIdStr);
            responseData = DEMO_BUSINESSES.find(b => b.id === placeId)?.activeRewards || [];
          } else {
            responseData = DEMO_BUSINESSES.flatMap(b => b.activeRewards);
          }
        }
        else if (cleanUrl.includes("/api/surveys")) {
          const placeId = parseInt(new URLSearchParams(url.split('?')[1]).get("placeId") || "1");
          responseData = DEMO_BUSINESSES.find(b => b.id === placeId)?.surveys || DEMO_BUSINESSES[0].surveys;
        }
        else if (cleanUrl.includes("/api/daily-tasks")) {
          const placeId = parseInt(new URLSearchParams(url.split('?')[1]).get("placeId") || "1");
          responseData = DEMO_BUSINESSES.find(b => b.id === placeId)?.tasks || DEMO_BUSINESSES[0].tasks;
        }
        else if (cleanUrl.includes("/api/wallet/transactions")) responseData = DEMO_TRANSACTIONS;
        else if (cleanUrl.includes("/api/wallet/cashouts")) responseData = DEMO_CASHOUTS;
        else if (cleanUrl.includes("/api/users/me/points-history")) responseData = DEMO_TRANSACTIONS;
        else if (cleanUrl.includes("/api/users/me/redemptions")) responseData = DEMO_WALKTHROUGH.wallet.redemptions;
        else if (cleanUrl.includes("/api/rewards/history")) responseData = DEMO_WALKTHROUGH.wallet.redemptions;
        else if (cleanUrl.includes("/api/host/applications")) {
          if (cleanUrl.endsWith("/api/host/applications")) {
            // Return all host applications from demo users
            responseData = [
              {
                id: 101,
                username: "demo_user",
                displayName: "Alexander Thorne",
                email: "alex@example.com",
                hostName: "Alex's Events",
                hostBio: "Hosting unique experiences in Cape Town's most vibrant venues",
                hostCategories: ["Social", "Networking", "Nightlife"],
                hostApplicationStatus: "approved",
                hostApplicationDate: new Date("2024-02-14"),
                hostMembershipTier: "active",
                paymentReference: "TRND-HOST-101",
                proofOfPayment: "https://example.com/payment/101",
                paymentVerified: true,
                paymentDate: new Date("2024-02-14")
              },
              {
                id: 102,
                username: "Alex_Creative",
                displayName: "Alex Creative",
                email: "alex.creative@example.com",
                hostName: "Creative Events",
                hostBio: "Creative workshops and art events for everyone",
                hostCategories: ["Art", "Workshops"],
                hostApplicationStatus: "pending",
                hostApplicationDate: new Date("2024-02-20"),
                hostMembershipTier: "starter",
                paymentReference: "TRND-HOST-102",
                proofOfPayment: "https://example.com/payment/102",
                paymentVerified: true,
                paymentDate: new Date("2024-02-20")
              },
              {
                id: 103,
                username: "Sarah_Wellness",
                displayName: "Sarah Wellness",
                email: "sarah.wellness@example.com",
                hostName: "Wellness Events",
                hostBio: "Yoga, meditation, and wellness workshops",
                hostCategories: ["Wellness", "Health"],
                hostApplicationStatus: "rejected",
                hostApplicationDate: new Date("2024-02-18"),
                hostMembershipTier: "active",
                paymentReference: "TRND-HOST-103",
                proofOfPayment: "https://example.com/payment/103",
                paymentVerified: false,
                paymentDate: new Date("2024-02-18")
              }
            ];
          } else if (cleanUrl.includes("/approve")) {
            const id = parseInt(cleanUrl.split("/").reverse()[1]);
            responseData = { success: true, message: `Application ${id} approved` };
          } else if (cleanUrl.includes("/reject")) {
            const id = parseInt(cleanUrl.split("/").reverse()[1]);
            responseData = { success: true, message: `Application ${id} rejected` };
          } else if (cleanUrl.includes("/request-correction")) {
            const id = parseInt(cleanUrl.split("/").reverse()[1]);
            responseData = { success: true, message: `Correction requested for application ${id}` };
          } else if (cleanUrl.includes("/api/host/applications/")) {
            const id = parseInt(cleanUrl.split("/").pop() || "0");
            responseData = [
              {
                id: 101,
                username: "demo_user",
                displayName: "Alexander Thorne",
                email: "alex@example.com",
                hostName: "Alex's Events",
                hostBio: "Hosting unique experiences in Cape Town's most vibrant venues",
                hostCategories: ["Social", "Networking", "Nightlife"],
                hostApplicationStatus: "approved",
                hostApplicationDate: new Date("2024-02-14"),
                hostMembershipTier: "active",
                paymentReference: "TRND-HOST-101",
                proofOfPayment: "https://example.com/payment/101",
                paymentVerified: true,
                paymentDate: new Date("2024-02-14")
              },
              {
                id: 102,
                username: "Alex_Creative",
                displayName: "Alex Creative",
                email: "alex.creative@example.com",
                hostName: "Creative Events",
                hostBio: "Creative workshops and art events for everyone",
                hostCategories: ["Art", "Workshops"],
                hostApplicationStatus: "pending",
                hostApplicationDate: new Date("2024-02-20"),
                hostMembershipTier: "starter",
                paymentReference: "TRND-HOST-102",
                proofOfPayment: "https://example.com/payment/102",
                paymentVerified: true,
                paymentDate: new Date("2024-02-20")
              },
              {
                id: 103,
                username: "Sarah_Wellness",
                displayName: "Sarah Wellness",
                email: "sarah.wellness@example.com",
                hostName: "Wellness Events",
                hostBio: "Yoga, meditation, and wellness workshops",
                hostCategories: ["Wellness", "Health"],
                hostApplicationStatus: "rejected",
                hostApplicationDate: new Date("2024-02-18"),
                hostMembershipTier: "active",
                paymentReference: "TRND-HOST-103",
                proofOfPayment: "https://example.com/payment/103",
                paymentVerified: false,
                paymentDate: new Date("2024-02-18")
              }
            ].find(app => app.id === id) || null;
          } else {
            responseData = { success: true, message: "Application submitted successfully" };
          }
        }
        else if (cleanUrl.includes("/api/host/plans")) {
          responseData = {
            starter: { name: "Starter Host", price: 49.99, maxEvents: 15, description: "Up to 15 events per month" },
            active: { name: "Active Host", price: 79.99, maxEvents: 30, description: "Up to 30 events per month" },
            pro: { name: "Pro Host", price: 99.99, maxEvents: Infinity, description: "Unlimited events" }
          };
        }
        else if (cleanUrl.includes("/api/host/membership")) {
          responseData = {
            tier: "active",
            status: "active",
            startDate: new Date("2024-02-15"),
            endDate: new Date("2024-03-15"),
            maxEvents: 30,
            usedEvents: 5
          };
        }

        return responseData || {};
      }

      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
