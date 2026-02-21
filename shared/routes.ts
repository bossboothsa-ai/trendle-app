import { z } from 'zod';
import {
  insertUserSchema,
  insertPlaceSchema,
  insertPostSchema,
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
  cashouts,
  events,
  eventAttendees,
  eventAnalytics,
  eventCategories,
  eventStatuses,
  checkInMethods,
  hostCategories,
  eventPromotionTiers,
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
  },

  // === EVENTS ===
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events' as const,
      input: z.object({
        status: z.enum(eventStatuses).optional(),
        category: z.string().optional(),
        venueId: z.number().optional(),
        featured: z.boolean().optional(),
        trending: z.boolean().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect & {
          venue: typeof places.$inferSelect | null;
          attendeesCount: number;
          postsCount: number;
        }>()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/events/:id' as const,
      responses: {
        200: z.custom<typeof events.$inferSelect & {
          venue: typeof places.$inferSelect | null;
          attendeesCount: number;
          postsCount: number;
          isAttending: boolean;
          isCheckedIn: boolean;
        }>(),
        404: errorSchemas.notFound,
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/events' as const,
      input: z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        coverImage: z.string().url().optional(),
        venueId: z.number(),
        hostName: z.string(),
        hostType: z.enum(['business', 'organizer']).default('business'),
        category: z.enum(eventCategories),
        startDateTime: z.string(), // ISO date string
        endDateTime: z.string(), // ISO date string
        pointsReward: z.number().default(100),
        postBonusPoints: z.number().default(50),
        checkInMethod: z.enum(checkInMethods).default('gps'),
        maxAttendees: z.number().optional(),
        location: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        promotionTier: z.enum(eventPromotionTiers).default('basic'),
      }),
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/events/:id' as const,
      input: z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        coverImage: z.string().url().optional(),
        category: z.enum(eventCategories).optional(),
        startDateTime: z.string().optional(),
        endDateTime: z.string().optional(),
        pointsReward: z.number().optional(),
        postBonusPoints: z.number().optional(),
        checkInMethod: z.enum(checkInMethods).optional(),
        maxAttendees: z.number().optional(),
        location: z.string().optional(),
        status: z.enum(eventStatuses).optional(),
        isFeatured: z.boolean().optional(),
        isTrending: z.boolean().optional(),
      }),
      responses: {
        200: z.custom<typeof events.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/events/:id' as const,
      responses: {
        204: z.null(),
        404: errorSchemas.notFound,
      }
    },
    // Attend an event
    attend: {
      method: 'POST' as const,
      path: '/api/events/:id/attend' as const,
      responses: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ message: z.string() }),
      }
    },
    // Cancel attendance
    cancelAttend: {
      method: 'POST' as const,
      path: '/api/events/:id/cancel-attend' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
      }
    },
    // Check-in to event
    checkIn: {
      method: 'POST' as const,
      path: '/api/events/:id/check-in' as const,
      input: z.object({
        method: z.enum(checkInMethods),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        qrCode: z.string().optional(),
      }),
      responses: {
        200: z.object({ success: z.boolean(), pointsEarned: z.number(), message: z.string() }),
        400: z.object({ message: z.string() }),
      }
    },
    // Get attendees
    attendees: {
      method: 'GET' as const,
      path: '/api/events/:id/attendees' as const,
      responses: {
        200: z.array(z.custom<typeof eventAttendees.$inferSelect & { user: typeof users.$inferSelect }>()),
      }
    },
    // Get event moments (posts during event)
    moments: {
      method: 'GET' as const,
      path: '/api/events/:id/moments' as const,
      responses: {
        200: z.array(z.custom<typeof posts.$inferSelect & { author: typeof users.$inferSelect }>()),
      }
    },
    // Rate event
    rate: {
      method: 'POST' as const,
      path: '/api/events/:id/rate' as const,
      input: z.object({
        rating: z.number().min(1).max(5),
        feedback: z.string().optional(),
      }),
      responses: {
        200: z.object({ success: z.boolean() }),
        400: z.object({ message: z.string() }),
      }
    },
    // Get user's events (attended/upcoming)
    myEvents: {
      method: 'GET' as const,
      path: '/api/events/my/:status' as const,
      input: z.object({
        status: z.enum(['upcoming', 'attended', 'all'])
      }),
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect & {
          venue: typeof places.$inferSelect | null;
          checkedIn: boolean;
          pointsEarned: number;
        }>()),
      }
    },
    // Admin: Approve/reject event
    approve: {
      method: 'POST' as const,
      path: '/api/events/:id/approve' as const,
      input: z.object({
        approved: z.boolean(),
        rejectionReason: z.string().optional(),
      }),
      responses: {
        200: z.object({ success: z.boolean() }),
        400: z.object({ message: z.string() }),
      }
    },
    // Admin: Get analytics
    analytics: {
      method: 'GET' as const,
      path: '/api/events/:id/analytics' as const,
      responses: {
        200: z.custom<typeof eventAnalytics.$inferSelect>(),
      }
    },
    // Admin: Platform-wide analytics
    platformAnalytics: {
      method: 'GET' as const,
      path: '/api/events/analytics/platform' as const,
      responses: {
        200: z.object({
          activeEventsToday: z.number(),
          totalCheckInsToday: z.number(),
          totalAttendees: z.number(),
          mostEngagingEvents: z.array(z.any()),
          venueParticipationRate: z.number(),
          trendingEvents: z.array(z.any()),
        }),
      }
    }
  },

  // === TRENDLE HOSTS ===
  hosts: {
    // Upgrade to host
    upgrade: {
      method: 'POST' as const,
      path: '/api/hosts/upgrade' as const,
      input: z.object({
        hostName: z.string().min(2),
        hostBio: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    // Get host profile
    profile: {
      method: 'GET' as const,
      path: '/api/hosts/profile' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      }
    },
    // Update host profile
    updateProfile: {
      method: 'PUT' as const,
      path: '/api/hosts/profile' as const,
      input: z.object({
        hostName: z.string().min(2).optional(),
        hostBio: z.string().optional(),
        hostAvatar: z.string().url().optional(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    // Get host's events
    events: {
      method: 'GET' as const,
      path: '/api/hosts/events' as const,
      input: z.object({
        status: z.enum(eventStatuses).optional(),
      }).optional(),
      responses: {
        200: z.array(z.any()),
      }
    },
    // Create host event
    createEvent: {
      method: 'POST' as const,
      path: '/api/hosts/events' as const,
      input: z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        coverImage: z.string().url().optional(),
        venueId: z.number(),
        category: z.enum(hostCategories),
        startDateTime: z.string(),
        endDateTime: z.string(),
        pointsReward: z.number().default(100),
        maxAttendees: z.number().optional(),
        location: z.string().optional(),
        promotionTier: z.enum(eventPromotionTiers).default('basic'),
      }),
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    // Update host event
    updateEvent: {
      method: 'PUT' as const,
      path: '/api/hosts/events/:id' as const,
      input: z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        coverImage: z.string().url().optional(),
        category: z.enum(hostCategories).optional(),
        startDateTime: z.string().optional(),
        endDateTime: z.string().optional(),
        pointsReward: z.number().optional(),
        maxAttendees: z.number().optional(),
        location: z.string().optional(),
        status: z.enum(eventStatuses).optional(),
      }),
      responses: {
        200: z.custom<typeof events.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    },
    // Delete host event
    deleteEvent: {
      method: 'DELETE' as const,
      path: '/api/hosts/events/:id' as const,
      responses: {
        204: z.null(),
        404: errorSchemas.notFound,
      }
    },
    // Promote event (pay-per-push)
    promoteEvent: {
      method: 'POST' as const,
      path: '/api/hosts/events/:id/promote' as const,
      input: z.object({
        tier: z.enum(eventPromotionTiers),
        paymentMethod: z.enum(['in_app', 'invoice']),
      }),
      responses: {
        201: z.object({
          promotion: z.object({
            id: z.number(),
            tier: z.string(),
            amount: z.number(),
            invoiceNumber: z.string().optional(),
            invoiceUrl: z.string().optional(),
          }),
          message: z.string(),
        }),
        400: z.object({ message: z.string() }),
      }
    },
    // Get promotion status
    promotionStatus: {
      method: 'GET' as const,
      path: '/api/hosts/events/:id/promotion' as const,
      responses: {
        200: z.any(),
      }
    },
    // Get host analytics
    analytics: {
      method: 'GET' as const,
      path: '/api/hosts/analytics' as const,
      responses: {
        200: z.object({
          totalEvents: z.number(),
          totalAttendees: z.number(),
          upcomingEvents: z.number(),
          completedEvents: z.number(),
          totalPromotions: z.number(),
          recentPerformance: z.array(z.object({
            eventId: z.number(),
            eventName: z.string(),
            attendees: z.number(),
            checkIns: z.number(),
            date: z.string(),
          })),
        }),
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
