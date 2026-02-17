import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

import { DEMO_USERS, DEMO_BUSINESSES, DEMO_POSTS, DEMO_NOTIFICATIONS } from "./demo-data";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const isDemoMode = localStorage.getItem("TRENDLE_DEMO_MODE") === "true";

  if (isDemoMode) {
    console.log(`[DEMO MODE] Intercepting ${method} ${url}`);

    // Simple router for demo data
    let responseData: any = null;

    if (url.includes("/api/users/me")) responseData = DEMO_USERS[0];
    else if (url.includes("/api/users/suggested")) responseData = DEMO_USERS.slice(1, 4);
    else if (url.includes("/api/posts")) responseData = DEMO_POSTS;
    else if (url.includes("/api/places")) responseData = DEMO_BUSINESSES;
    else if (url.includes("/api/notifications")) responseData = DEMO_NOTIFICATIONS;
    else if (url.includes("/api/rewards")) responseData = DEMO_BUSINESSES[0].activeRewards;
    else if (url.includes("/api/surveys")) responseData = DEMO_BUSINESSES[0].surveys;
    else if (url.includes("/api/daily-tasks")) responseData = DEMO_BUSINESSES[0].tasks;

    // Simulate successful mutation
    if (method !== "GET" && !responseData) responseData = { success: true, points: 50 };

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
      const isDemoMode = localStorage.getItem("TRENDLE_DEMO_MODE") === "true";

      if (isDemoMode && url.startsWith("/api")) {
        console.log(`[DEMO MODE] Intercepting GET ${url}`);

        let responseData: any = null;
        if (url.includes("/api/users/me")) responseData = DEMO_USERS[0];
        else if (url.includes("/api/users/suggested")) responseData = DEMO_USERS.slice(1, 4);
        else if (url.includes("/api/posts")) responseData = DEMO_POSTS;
        else if (url.includes("/api/places")) responseData = DEMO_BUSINESSES;
        else if (url.includes("/api/notifications")) responseData = DEMO_NOTIFICATIONS;
        else if (url.includes("/api/rewards")) responseData = DEMO_BUSINESSES[0].activeRewards;
        else if (url.includes("/api/surveys")) responseData = DEMO_BUSINESSES[0].surveys;
        else if (url.includes("/api/daily-tasks")) responseData = DEMO_BUSINESSES[0].tasks;

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
