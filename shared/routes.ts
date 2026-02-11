import { z } from 'zod';
import { 
  insertUserSchema, 
  insertPlaceSchema, 
  insertPostSchema, 
  insertCommentSchema,
  insertRewardSchema,
  users,
  places,
  posts,
  rewards,
  notifications,
  comments
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  // === USERS ===
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users' as const,
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/users/:id' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    me: { // For the current "mock" logged in user
      method: 'GET' as const,
      path: '/api/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      }
    }
  },

  // === PLACES (EXPLORE) ===
  places: {
    list: {
      method: 'GET' as const,
      path: '/api/places' as const,
      responses: {
        200: z.array(z.custom<typeof places.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/places/:id' as const,
      responses: {
        200: z.custom<typeof places.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },

  // === POSTS (FEED) ===
  posts: {
    list: {
      method: 'GET' as const,
      path: '/api/posts' as const,
      input: z.object({
        filter: z.enum(['all', 'following']).optional(),
        placeId: z.string().optional()
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof posts.$inferSelect & { author: typeof users.$inferSelect, place: typeof places.$inferSelect | null, hasLiked: boolean }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/posts' as const,
      input: insertPostSchema,
      responses: {
        201: z.custom<typeof posts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    like: {
      method: 'POST' as const,
      path: '/api/posts/:id/like' as const,
      responses: {
        200: z.object({ success: z.boolean(), points: z.number() }),
        404: errorSchemas.notFound,
      },
    }
  },

  // === COMMENTS ===
  comments: {
    list: {
      method: 'GET' as const,
      path: '/api/posts/:postId/comments' as const,
      responses: {
        200: z.array(z.custom<typeof comments.$inferSelect & { author: typeof users.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/posts/:postId/comments' as const,
      input: z.object({ text: z.string() }),
      responses: {
        201: z.custom<typeof comments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  },

  // === REWARDS ===
  rewards: {
    list: {
      method: 'GET' as const,
      path: '/api/rewards' as const,
      responses: {
        200: z.array(z.custom<typeof rewards.$inferSelect>()),
      },
    },
    redeem: {
      method: 'POST' as const,
      path: '/api/rewards/:id/redeem' as const,
      responses: {
        200: z.object({ success: z.boolean(), newPoints: z.number() }),
        400: z.object({ message: z.string() }), // E.g. not enough points
      },
    }
  },

  // === NOTIFICATIONS ===
  notifications: {
    list: {
      method: 'GET' as const,
      path: '/api/notifications' as const,
      responses: {
        200: z.array(z.custom<typeof notifications.$inferSelect>()),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
