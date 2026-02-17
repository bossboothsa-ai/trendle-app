
import "dotenv/config";
import { storage } from "../server/storage";
import { User } from "@shared/schema";
import bcrypt from "bcryptjs";

async function createAdmin() {
    const username = process.argv[2] || "admin";
    const password = process.argv[3] || "admin123";
    const email = process.argv[4] || "admin@trendle.com";

    if (!username || !password || !email) {
        console.error("Usage: npx tsx scripts/create-admin.ts <username> <password> <email>");
        process.exit(1);
    }

    console.log(`Checking for existing admin: ${username}`);
    const existingUser = await storage.getUserByUsername(username);

    if (existingUser) {
        console.log(`User '${username}' already exists.`);
        if (existingUser.role !== "admin") {
            console.log(`Updating role to admin...`);
            await storage.updateUser(existingUser.id, { role: "admin" });
            console.log("Updated.");
        } else {
            console.log("Already an admin.");
        }
        process.exit(0);
    }

    console.log(`Creating admin user: ${username}`);
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await storage.createUser({
            username,
            password: hashedPassword,
            email,
            role: "admin",
            status: "active",
            emailVerified: true,
            phoneNumber: "0000000000",
            avatar: `https://ui-avatars.com/api/?name=${username}&background=random`
        });

        console.log(`Admin user created successfully! ID: ${user.id}`);
    } catch (error) {
        console.error("Failed to create admin user:", error);
        process.exit(1);
    }

    process.exit(0);
}

createAdmin().catch(console.error);
