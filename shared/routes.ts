import { z } from 'zod';
import {
  insertUserSchema,
  insertPlaceSchema,
  insertPostSchema,
  insertCommentSchema,
  insertRewardSchema,
  insertSurveyResponseSchema,
  insertStorySchema,
  users,
  places,
  posts,
  rewards,
  notifications,
  comments,
  surveys,
  dailyTasks,
  userRewards,
  userDailyTasks,
  pointsHistory,
  stories,
  cashouts
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
        200: z.custom<typeof users.$inferSelect & { hasFollowed: boolean }>(),
        404: errorSchemas.notFound,
      },
    },
    suggested: {
      method: 'GET' as const,
      path: '/api/users/suggested' as const,
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      }
    },
    pointsHistory: {
      method: 'GET' as const,
      path: '/api/users/me/points-history' as const,
      responses: {
        200: z.array(z.custom<typeof pointsHistory.$inferSelect>()),
      }
    },
    redemptionHistory: {
      method: 'GET' as const,
      path: '/api/users/me/redemptions' as const,
      responses: {
        200: z.array(z.custom<typeof userRewards.$inferSelect & { reward: typeof rewards.$inferSelect }>()),
      }
    },
    follow: {
      method: 'POST' as const,
      path: '/api/users/follow/:id' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchemas.notFound,
      }
    },
    unfollow: {
      method: 'POST' as const,
      path: '/api/users/unfollow/:id' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchemas.notFound,
      }
    },
    me: { // For the current "mock" logged in user
      method: 'GET' as const,
      path: '/api/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect & { hasFollowed: boolean }>(),
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/users/:id' as const,
      input: insertUserSchema.partial(),
      responses: {
        200: z.custom<typeof users.$inferSelect & { hasFollowed: boolean }>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
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
        filter: z.enum(['all', 'following', 'foryou']).optional(),
        placeId: z.string().optional(),
        userId: z.number().optional()
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof posts.$inferSelect & {
          author: typeof users.$inferSelect,
          place: typeof places.$inferSelect | null,
          hasLiked: boolean,
          hasFollowed: boolean
        }>()),
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
    update: {
      method: 'PUT' as const,
      path: '/api/posts/:id' as const,
      input: insertPostSchema.partial(),
      responses: {
        200: z.custom<typeof posts.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/posts/:id' as const,
      responses: {
        204: z.null(),
        404: errorSchemas.notFound,
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
      input: z.object({ type: z.enum(['airtime', 'voucher', 'discount']) }),
      responses: {
        200: z.object({ success: z.boolean(), newPoints: z.number() }),
        400: z.object({ message: z.string() }), // E.g. not enough points
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/rewards/history' as const,
      responses: {
        200: z.array(z.custom<typeof userRewards.$inferSelect & { reward: typeof rewards.$inferSelect }>()),
      }
    }
  },

  // === SURVEYS ===
  surveys: {
    list: {
      method: 'GET' as const,
      path: '/api/surveys' as const,
      responses: {
        200: z.array(z.custom<typeof surveys.$inferSelect>()),
      }
    },
    submit: {
      method: 'POST' as const,
      path: '/api/surveys/:id/submit' as const,
      input: z.object({ answers: z.any() }),
      responses: {
        200: z.object({ success: z.boolean(), points: z.number() }),
        400: z.object({ message: z.string() }),
      }
    }
  },

  // === DAILY TASKS ===
  dailyTasks: {
    list: {
      method: 'GET' as const,
      path: '/api/daily-tasks' as const,
      responses: {
        200: z.array(z.custom<typeof dailyTasks.$inferSelect & { completed: boolean }>()),
      }
    },
    complete: {
      method: 'POST' as const,
      path: '/api/daily-tasks/:id/complete' as const,
      responses: {
        200: z.object({ success: z.boolean(), points: z.number() }),
        400: z.object({ message: z.string() }),
      }
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
  },

  // === STORIES ===
  stories: {
    list: {
      method: 'GET' as const,
      path: '/api/stories' as const,
      responses: {
        200: z.array(z.custom<typeof stories.$inferSelect & { user: typeof users.$inferSelect }>()),
      },
    },
    user: {
      method: 'GET' as const,
      path: '/api/stories/user/:userId' as const,
      responses: {
        200: z.array(z.custom<typeof stories.$inferSelect & { user: typeof users.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/stories' as const,
      input: insertStorySchema,
      responses: {
        201: z.custom<typeof stories.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },

  // === WALLET & CASHOUTS ===
  wallet: {
    transactions: {
      method: 'GET' as const,
      path: '/api/wallet/transactions' as const,
      responses: {
        200: z.array(z.any()), // [id, type, amount, description, status, date]
      }
    },
    cashouts: {
      list: {
        method: 'GET' as const,
        path: '/api/wallet/cashouts' as const,
        responses: {
          200: z.array(z.custom<typeof cashouts.$inferSelect>()),
        }
      },
      create: {
        method: 'POST' as const,
        path: '/api/wallet/cashouts' as const,
        input: z.object({
          amount: z.number(),
          type: z.enum(['bank', 'mobile', 'airtime']),
          details: z.any()
        }),
        responses: {
          201: z.custom<typeof cashouts.$inferSelect>(),
          400: z.object({ message: z.string() }),
        }
      }
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
