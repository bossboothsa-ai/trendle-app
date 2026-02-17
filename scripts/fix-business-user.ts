import "dotenv/config";
import { db } from "../server/db";
import { users, businessAccounts } from "@shared/schema";
import { eq } from "drizzle-orm";
import { storage } from "../server/storage";

async function run() {
    console.log("Fixing account via Email...");
    try {
        // Find by Email (Raw DB to be safe)
        const [user] = await db.select().from(users).where(eq(users.email, "bossboothsa@gmail.com"));

        if (!user) {
            console.log("User bossboothsa@gmail.com not found!");

            // Debug: List all emails
            const all = await db.select().from(users);
            console.log("Available emails:", all.map(u => u.email).join(", "));

            process.exit(1);
        }

        console.log(`Found user: ID ${user.id}, Username "${user.username}", Role "${user.role}"`);

        // 1. Update role
        await storage.updateUser(user.id, {
            role: "business",
            emailVerified: true,
            status: "active"
        } as any);
        console.log("Updated role to 'business' and verified.");

        // 2. Create business profile
        const existingBiz = await storage.getBusinessAccountByUserId(user.id);
        if (!existingBiz) {
            console.log("Creating business profile...");
            await storage.createBusinessAccount({
                userId: user.id,
                businessName: "Boss Booth SA",
                city: "Johannesburg",
                category: "Entertainment",
                contactPerson: "Boss",
                contactEmail: user.email,
                contactPhone: user.phoneNumber || "0000000000",
                placeId: 0,
                status: "active"
            });
            console.log("Business profile created.");
        } else {
            console.log("Business profile already exists.");
        }

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
    process.exit(0);
}
run();
