# Trendle - Social Creator Web App

## Overview

Trendle is a social creator web app built around local check-ins, rewards, and community engagement, set in Cape Town. It combines Instagram/Snapchat-style social features (posts, likes, comments, stories) with a gamified points and rewards system. Users earn points by checking in at partner venues, posting moments, completing daily tasks, and engaging socially. The app has a vibrant, mobile-first UI with a purple/pink gradient brand identity.

The app simulates a logged-in user (User ID 1) and uses seeded mock data to feel alive and active. There is no real authentication system — the current user is hardcoded.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight alternative to React Router)
- **State/Data**: TanStack React Query for server state management. No client-side global state store — queries and mutations handle all data flow.
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS. Component files live in `client/src/components/ui/`.
- **Styling**: Tailwind CSS with CSS variables for theming. Custom fonts (Outfit for display, Plus Jakarta Sans for body). Mobile-first responsive design with bottom navigation on mobile.
- **Animations**: Framer Motion for page transitions and micro-interactions.
- **Icons**: Lucide React
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Pages
- **Home** (`/`): Social feed with story rail, post cards, like/comment interactions
- **Explore** (`/explore`): Discover local places/venues with category filtering
- **Rewards** (`/rewards`): Points balance display and reward redemption
- **Profile** (`/profile`): User profile with posts grid, stats
- **Notifications** (`/notifications`): Activity feed (likes, comments, follows)
- **Create Post**: Modal triggered from bottom nav center button

### Backend
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript, executed with tsx
- **API Pattern**: REST API under `/api/*` prefix. Routes are defined in `server/routes.ts` and route metadata/schemas are shared via `shared/routes.ts`.
- **Storage Layer**: `server/storage.ts` defines an `IStorage` interface that abstracts all data operations. The implementation uses Drizzle ORM with PostgreSQL.
- **Dev Server**: Vite dev server runs as middleware inside Express during development (configured in `server/vite.ts`). In production, static files are served from `dist/public`.

### Shared Layer (`shared/`)
- **Schema** (`shared/schema.ts`): Drizzle ORM table definitions for PostgreSQL — users, places, posts, comments, likes, follows, rewards, userRewards, notifications, surveys, surveyResponses, dailyTasks, userDailyTasks. Insert schemas are generated with `drizzle-zod`.
- **Routes** (`shared/routes.ts`): API route definitions with paths, methods, and Zod response schemas. Includes a `buildUrl` helper for parameterized routes. This creates a type-safe contract between frontend and backend.

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Driver**: `pg` (node-postgres) with connection pooling
- **Schema management**: `drizzle-kit push` for schema sync (no migration files needed for dev)
- **Connection**: Requires `DATABASE_URL` environment variable
- **Session store**: `connect-pg-simple` is available (listed in dependencies)

### Key Data Models
- **Users**: id, username, avatar, level (Silver/Gold/Platinum), points, bio
- **Places**: Partner venues with name, location, distance, image, pointsPerVisit, category
- **Posts**: User-created moments with image, caption, optional place check-in, like/comment counts
- **Comments/Likes**: Standard social interactions tied to posts and users
- **Follows**: User-to-user follow relationships
- **Rewards**: Redeemable items with point costs
- **Notifications**: Activity notifications (likes, comments, follows)
- **Surveys & Daily Tasks**: Engagement mechanics for earning additional points

### Build System
- **Development**: `npm run dev` runs tsx with Vite middleware for HMR
- **Production build**: `npm run build` runs a custom script (`script/build.ts`) that builds the client with Vite and bundles the server with esbuild into `dist/index.cjs`
- **Production start**: `npm start` runs the bundled server

## External Dependencies

- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable. Required for the app to function.
- **Unsplash**: Images are loaded directly from Unsplash URLs for avatars, post images, and place photos (no API key needed — uses direct image URLs).
- **Google Fonts**: Outfit and Plus Jakarta Sans loaded via CDN in index.html and CSS imports.
- **No authentication service**: User is hardcoded as ID 1 via `/api/me` endpoint.
- **No file upload service**: Image uploads are simulated with random Unsplash URLs.