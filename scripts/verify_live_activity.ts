
import { storage } from "../server/mockStorage";

async function verifyLiveActivity() {
    console.log("Starting Live Activity Verification...");

    // Seed data first
    console.log("Seeding data...");
    await storage.seed();

    const placeId = 1;
    const userId = 1; // "Me"

    // 1. Create a Reward for Place 1
    console.log("Creating test reward...");
    const reward = await storage.createReward({
        title: "Test Reward " + Date.now(),
        description: "Test Description",
        cost: 10,
        placeId: placeId,
        image: "test.jpg",
        category: "food"
    });
    console.log("Created Reward:", reward.id, reward.title);

    // 2. User Redeems Reward
    console.log("User redeeming reward...");
    await storage.redeemReward(userId, reward.id, "online");

    // Find the user reward id
    const history = await storage.getRedemptionHistory(userId);
    const userReward = history.find(r => r.rewardId === reward.id);

    if (!userReward) {
        console.error("Redemption failed: User reward not found.");
        process.exit(1);
    }
    console.log("Redeemed Reward ID:", userReward.id);

    // 3. Business Validates Reward (Simulate Frontend Code scanning)
    console.log("Business validating reward...");
    const validation = await storage.validateReward(userReward.id, placeId);
    if (!validation.valid) {
        console.error("Validation failed:", validation.message);
        process.exit(1);
    }
    console.log("Validation Successful:", validation.message);

    // 4. Check Business Dashboard for Activity
    console.log("Checking Business Dashboard Activity Feed...");
    const dashboard = await storage.getBusinessDashboard(placeId);

    const recentActivity = dashboard.recentActivity;
    if (!recentActivity) {
        console.error("Dashboard has no recentActivity field!");
        process.exit(1);
    }

    // Find our redemption in activity
    const activityItem = recentActivity.find((a: any) =>
        a.type === 'redemption' && a.id === `redeem-${userReward.id}`
    );

    if (activityItem) {
        console.log("SUCCESS: Found redemption in Live Activity Feed!");
        console.log(activityItem);
    } else {
        console.error("FAILURE: Redemption not found in Live Activity Feed.");
        console.log("Recent Activities:", recentActivity);
        process.exit(1);
    }

    // 5. Also check a Check-in
    console.log("Creating a check-in...");
    const checkin = await storage.createCheckin({ userId, placeId });

    const dashboard2 = await storage.getBusinessDashboard(placeId);
    const checkinItem = dashboard2.recentActivity.find((a: any) =>
        a.type === 'checkin' && a.id === `checkin-${checkin.id}`
    );

    if (checkinItem) {
        console.log("SUCCESS: Found check-in in Live Activity Feed!");
        console.log(checkinItem);
    } else {
        console.error("FAILURE: Check-in not found in Live Activity Feed.");
        process.exit(1);
    }
}

verifyLiveActivity().catch(console.error);
