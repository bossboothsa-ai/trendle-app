import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

let pool: pg.Pool | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });
} else {
  console.warn(
    "⚠️  DATABASE_URL is not set. Database features will be unavailable. " +
      "Set DATABASE_URL in your environment to enable persistence.",
  );
}

export { pool };
export const db = pool ? drizzle(pool, { schema }) : (null as any);
