import "dotenv/config";
import { storage } from "../server/storage";
import { db } from "../server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function run() {
    console.log("Checking for Admin account...");
    try {
        const email = "admin@trendle.com";
        const password = "admin123";

        // Check if exists by email
        const [existing] = await db.select().from(users).where(eq(users.email, email));

        if (existing) {
            console.log(`Admin account exists: ID ${existing.id} (${existing.username})`);
            // Ensure role is admin
            if (existing.role !== "admin" || !existing.emailVerified) {
                console.log("Updating admin role/verification...");
                await storage.updateUser(existing.id, {
                    role: "admin",
                    emailVerified: true,
                    status: "active"
                } as any);
                console.log("Admin account updated.");
            }
        } else {
            console.log("Creating new Admin account...");
            const hashedPassword = await bcrypt.hash(password, 10);

            // Check if username 'admin' is taken
            const userWithUsername = await storage.getUserByUsername("admin");
            const username = userWithUsername ? "admin_super" : "admin";

            await storage.createUser({
                username,
                email,
                password: hashedPassword,
                role: "admin",
                emailVerified: true,
                status: "active",
                phoneNumber: "0000000000",
                avatar: `https://ui-avatars.com/api/?name=Admin&background=random`
            } as any);
            console.log(`Admin account created with username: ${username}, password: ${password}`);
        }

    } catch (e) {
        console.error("Error ensuring admin:", e);
        process.exit(1);
    }
    process.exit(0);
}
run();
