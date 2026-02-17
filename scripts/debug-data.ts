import "dotenv/config";
import { db } from "../server/db";
import { users } from "@shared/schema";

async function run() {
    console.log("Listing all users...");
    try {
        const all = await db.select().from(users);
        if (all.length === 0) {
            console.log("No users found in database.");
        }
        all.forEach(u => {
            console.log(`ID: ${u.id}, Username: "${u.username}", Email: "${u.email}", Role: "${u.role}"`);
        });
    } catch (e) {
        console.error("Error listing users:", e);
    }
    process.exit(0);
}
run();
