
import { storage } from "../server/mockStorage";

async function verifyAdminFlows() {
    console.log("Starting Super Admin Flow Verification...");

    // 1. Setup & Seed
    console.log("Seeding data...");
    await storage.seed();
    const placeId = 1;
    const userId = 1;

    // 2. Generate Activity (User & Business)
    console.log("Generating Activity...");

    // Action A: Check-in
    const checkin = await storage.createCheckin({ userId, placeId });
    console.log(`User checked in (ID: ${checkin.id})`);

    // Action B: Reward Redemption & Validation
    const reward = await storage.createReward({
        title: "Admin Test Reward",
        description: "Testing Logs",
        cost: 5,
        placeId,
        image: "log_test.jpg",
        category: "food"
    });

    await storage.redeemReward(userId, reward.id, "online");
    const history = await storage.getRedemptionHistory(userId);
    const userReward = history.find(r => r.rewardId === reward.id);

    if (userReward) {
        await storage.validateReward(userReward.id, placeId);
        console.log(`Reward validated (ID: ${userReward.id})`);
    }

    // 3. Verify Activity Logs
    console.log("Verifying Global Activity Logs...");
    const logs = await storage.getSystemLogs({});

    // Check for "Check-in"
    const checkinLog = logs.find(l => l.action === "Check-in" && l.details?.checkinId === checkin.id);
    if (checkinLog) {
        console.log("PASS: Check-in found in Admin Logs");
    } else {
        console.error("FAIL: Check-in NOT found in Admin Logs");
        // console.log(logs.filter(l => l.action === "Check-in"));
    }

    // Check for "Reward Validation"
    // Note: The action name in mockStorage.validateReward is "Reward Validation"
    const validationLog = logs.find(l => l.action === "Reward Validation");
    if (validationLog) {
        console.log("PASS: Reward Validation found in Admin Logs");
    } else {
        console.error("FAIL: Reward Validation NOT found in Admin Logs");
    }

    // 4. Verify User Management (Warn/Suspend)
    console.log("Verifying User Management...");
    const userBefore = await storage.getUser(userId);
    console.log(`User Status: ${userBefore?.status}, Warnings: ${userBefore?.warnings}`);

    // Simulate "Warn"
    await storage.updateUser(userId, {
        warnings: (userBefore?.warnings || 0) + 1,
        adminNotes: "Test Warning from Script"
    });
    const userAfterWarn = await storage.getUser(userId);
    if (userAfterWarn?.warnings === (userBefore?.warnings || 0) + 1) {
        console.log("PASS: User Warning count incremented");
    } else {
        console.error("FAIL: User Warning not applied");
    }

    // Simulate "Suspend"
    await storage.updateUser(userId, { status: "suspended" });
    const userAfterSuspend = await storage.getUser(userId);
    if (userAfterSuspend?.status === "suspended") {
        console.log("PASS: User Suspended successfully");
    } else {
        console.error("FAIL: User Suspension failed");
    }

    // 5. Verify Subscription Management (Invoice Paid)
    console.log("Verifying Subscription Management...");

    // Get business account
    const account = await storage.getBusinessAccountByPlaceId(placeId);
    if (!account) {
        console.error("FAIL: Business Account not found");
        process.exit(1);
    }
    console.log(`Business Invoice Status: ${account.invoiceStatus}`);

    // Mark as Paid
    await storage.markInvoicePaid(account.placeId); // Logic uses placeId or businessId? 
    // Checking adminRoutes.ts: app.post("/api/admin/invoices/:businessId/mark-paid") calls storage.markInvoicePaid(businessId)
    // Checking mockStorage.ts would be prudent, but assuming it takes ID based on route param name usually being businessId/placeId
    // Let's check the result
    const accountAfter = await storage.getBusinessAccountByPlaceId(placeId);
    if (accountAfter?.invoiceStatus === "Paid") {
        console.log("PASS: Invoice marked as Paid");
    } else {
        console.error(`FAIL: Invoice status is ${accountAfter?.invoiceStatus}`);
    }

    console.log("Super Admin Verification Complete.");
}

verifyAdminFlows().catch(console.error);
