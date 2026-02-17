
import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function resetDb() {
    console.log("🗑️  Starting clean database reset...");

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("❌ DATABASE_URL is not defined in process.env");
    } else {
        // Mask password for safety
        const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":***@");
        console.log(`ℹ️  DATABASE_URL loaded: ${maskedUrl}`);
    }

    try {
        await db.execute(sql`
      TRUNCATE TABLE 
        users, 
        business_accounts, 
        places, 
        posts, 
        comments, 
        likes, 
        follows, 
        rewards, 
        user_rewards, 
        notifications, 
        stories, 
        surveys, 
        survey_responses, 
        daily_tasks, 
        user_daily_tasks, 
        points_history, 
        cashouts, 
        device_fingerprints, 
        image_hashes, 
        fraud_flags, 
        user_daily_limits, 
        checkins, 
        business_daily_metrics, 
        report_exports, 
        business_audit_log
      RESTART IDENTITY CASCADE;
    `);

        console.log("✅ Database reset complete. All data deleted.");
    } catch (error) {
        console.error("❌ Failed to reset database:", error);
        process.exit(1);
    }

    process.exit(0);
}

resetDb();
