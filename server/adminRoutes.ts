import type { Express } from "express";
import { z } from "zod";
import type { IStorage } from "./storage";

export function registerAdminRoutes(app: Express, storage: IStorage) {

    // === ADMIN: BUSINESSES ===
    app.get("/api/admin/businesses", async (req, res) => {
        try {
            const places = await storage.getPlaces();

            // Join with business account details
            const detailedBusinesses = await Promise.all(places.map(async (p) => {
                const account = await storage.getBusinessAccountByPlaceId(p.id);
                return {
                    id: p.id,
                    businessId: account?.id,
                    name: p.name,
                    category: p.category,
                    city: p.location.split(',')[0], // Fallback if no account
                    status: account?.status || "active",
                    subscription: account?.subscriptionPlan || "basic",
                    subscriptionStatus: account?.subscriptionStatus || "active",
                    invoiceStatus: account?.invoiceStatus || "Paid",
                    lastActivity: "2 mins ago", // Mock
                    verification: "98%", // Mock
                    plan: account?.subscriptionPlan || "basic", // Add explicit plan field
                    contactEmail: account?.contactEmail
                };
            }));

            res.json(detailedBusinesses);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // Get Single Business Details
    app.get("/api/admin/businesses/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const place = await storage.getPlace(id);
            if (!place) return res.status(404).json({ error: "Business not found" });

            const account = await storage.getBusinessAccountByPlaceId(id);

            const detailedBusiness = {
                id: place.id,
                businessId: account?.id,
                name: place.name,
                category: place.category,
                city: place.location.split(',')[0],
                status: account?.status || "active",
                subscription: account?.subscriptionPlan || "basic",
                subscriptionStatus: account?.subscriptionStatus || "active",
                invoiceStatus: "Paid", // Mock
                lastActivity: "2 mins ago", // Mock
                verification: "98%", // Mock
                plan: account?.subscriptionPlan || "basic",
                contactEmail: account?.contactEmail,
                contactPhone: account?.contactPhone,
                address: account?.address || place.location,
                monthlyFee: account?.monthlyFee,
                publicId: `TRND-B${String(place.id).padStart(3, '0')}`
            };

            res.json(detailedBusiness);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // Create Business Flow
    app.post("/api/admin/businesses", async (req, res) => {
        try {
            const data = req.body;

            // 1. Create a User for the Business Owner
            let user = await storage.getUserByUsername(data.loginEmail);
            if (!user) {
                user = await storage.createUser({
                    username: data.loginEmail, // Use email as username for simplicity or derive it
                    email: data.loginEmail,
                    password: data.password || "trendle123",
                    role: "business",
                    status: "active",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + data.businessName,
                    displayName: data.businessName,
                    emailVerified: true
                });
            }

            // 2. Create Place
            const newPlace = await storage.createPlace({
                name: data.businessName,
                category: data.category,
                location: `${data.city}, ${data.address}`,
                image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500" // Default placeholder
            });

            // 3. Create Business Account
            const newAccount = await storage.createBusinessAccount({
                userId: user.id,
                placeId: newPlace.id,
                businessName: data.businessName,
                subscriptionPlan: data.plan,
                monthlyFee: typeof data.monthlyFee === 'string' ? parseInt(data.monthlyFee) : data.monthlyFee,
                invoiceDueDays: data.invoiceDueDays,
                gracePeriod: data.gracePeriod,
                contactPhone: data.phone,
                contactEmail: data.contactEmail,
                city: data.city,
                address: data.address,
                status: data.status,
                invoiceStatus: "Paid"
            });

            // 4. Log Action (Mock)
            console.log(`[ADMIN] Created business ${data.businessName} with plan ${data.plan}`);

            res.json({ place: newPlace, account: newAccount });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // Suspend/Deactivate/Reset
    app.post("/api/admin/businesses/:id/:action", async (req, res) => {
        const { id, action } = req.params;
        const placeId = parseInt(id);

        try {
            // Find account by placeId (since frontend ID is placeId)
            const account = await storage.getBusinessAccountByPlaceId(placeId);
            if (!account) return res.status(404).json({ error: "Business account not found" });

            if (action === "suspend") {
                await storage.updateBusinessAccount(account.id, { status: "suspended" });
            } else if (action === "deactivate") {
                await storage.updateBusinessAccount(account.id, { status: "deactivated" });
            } else if (action === "activate") {
                await storage.updateBusinessAccount(account.id, { status: "active" });
            } else if (action === "reset-password") {
                // Mock sending email
                console.log(`[EMAIL] Password reset link sent to ${account.contactEmail}`);
                return res.json({ success: true, message: "Reset link sent" });
            }

            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === ADMIN: USERS ===
    app.get("/api/admin/users", async (req, res) => {
        try {
            const users = await storage.getUsers();
            // Return real data mapped to frontend view
            const adminView = users.map(u => ({
                id: u.id,
                publicId: u.publicActivityId || `TRND-AX${String(u.id).padStart(3, '0')}`,
                username: u.username,
                email: u.email,
                status: u.status, // Real status
                risk: u.riskScore, // Real risk
                integrity: u.phoneVerified ? "Verified" : "Unverified",
                joinDate: "2024-01-15", // Mock date for now as it's not in schema yet
                lastActive: "2 hours ago",
                warnings: u.warnings
            }));
            res.json(adminView);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // Get Single User Details
    app.get("/api/admin/users/:id", async (req, res) => {
        try {
            const user = await storage.getUser(Number(req.params.id));
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // User Actions: Warn, Suspend, Reactivate, Escalate
    app.post("/api/admin/users/:id/:action", async (req, res) => {
        const { id, action } = req.params;
        const userId = Number(id);
        const { reason, notes } = req.body;

        try {
            const user = await storage.getUser(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            if (action === "warn") {
                await storage.updateUser(userId, {
                    warnings: (user.warnings || 0) + 1,
                    adminNotes: notes ? `${user.adminNotes || ''}\n[WARN]: ${notes}` : user.adminNotes
                });
            } else if (action === "suspend") {
                await storage.updateUser(userId, {
                    status: "suspended",
                    adminNotes: notes ? `${user.adminNotes || ''}\n[SUSPEND]: ${notes}` : user.adminNotes
                });
            } else if (action === "reactivate") {
                await storage.updateUser(userId, {
                    status: "active",
                    adminNotes: notes ? `${user.adminNotes || ''}\n[REACTIVATE]: ${notes}` : user.adminNotes
                });
            } else if (action === "escalate") {
                await storage.updateUser(userId, {
                    riskScore: "High",
                    adminNotes: notes ? `${user.adminNotes || ''}\n[ESCALATE]: ${notes}` : user.adminNotes
                });
            } else {
                return res.status(400).json({ message: "Invalid action" });
            }

            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    });

    // === ADMIN: VERIFICATION REQUESTS ===
    app.get("/api/admin/verification-requests", async (req, res) => {
        try {
            const requests = await storage.getVerificationRequests();
            res.json(requests);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/admin/verification-requests/:id/verify", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

            const updated = await storage.updateVerificationRequest(id, "Verified");

            // Find business and update its audit log? Or create system log
            await storage.createSystemLog({
                action: "Verification Approved",
                entityId: id,
                entityType: "verification_request",
                details: { status: "Verified" }
            });

            res.json({ success: true, request: updated });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === ADMIN: MODERATION ===
    app.get("/api/admin/moderation", async (req, res) => {
        const cases = await storage.getModerationCases();
        res.json(cases);
    });

    app.post("/api/admin/moderation/:id/:action", async (req, res) => {
        const { id, action } = req.params;
        const { notes } = req.body;

        let dbId = parseInt(id);
        if (isNaN(dbId) && id.startsWith("MOD-")) {
            dbId = parseInt(id.replace("MOD-", ""));
        }

        try {
            // Map frontend action to status
            let status: any = "pending";
            if (action === "dismiss") status = "dismissed";
            else if (action === "resolve") status = "resolved";
            else if (action === "suspend") status = "resolved";

            if (action === "warn") status = "resolved";
            if (action === "escalate") status = "investigating";

            const updatedCase = await storage.updateModerationCase(dbId, {
                status,
                adminNotes: notes,
                resolved: status === "resolved" || status === "dismissed"
            });

            // Log to system logs
            await storage.createSystemLog({
                action: `Moderation: ${action}`,
                entityId: dbId,
                entityType: "moderation_case",
                details: { action, notes, status }
            });

            // Execute specific actions
            if (action === "warn" && updatedCase) {
                const user = await storage.getUser(updatedCase.userId);
                if (user) {
                    await storage.updateUser(user.id, {
                        warnings: user.warnings + 1,
                        adminNotes: user.adminNotes ? `${user.adminNotes}\n[WARN from MOD-${dbId}]: ${notes}` : `[WARN from MOD-${dbId}]: ${notes}`
                    });
                }
            } else if (action === "suspend" && updatedCase) {
                const user = await storage.getUser(updatedCase.userId);
                if (user) {
                    await storage.updateUser(user.id, {
                        status: "suspended",
                        adminNotes: user.adminNotes ? `${user.adminNotes}\n[SUSPEND from MOD-${dbId}]: ${notes}` : `[SUSPEND from MOD-${dbId}]: ${notes}`
                    });
                }
            }

            res.json(updatedCase);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === ADMIN: ACTIVITY LOGS ===
    app.get("/api/admin/activity", async (req, res) => {
        const logs = await storage.getSystemLogs(req.query);
        // Transform for frontend if needed or standardizing
        const formattedLogs = logs.map(l => ({
            id: `LOG-${l.id}`,
            activityId: `ACT-${l.id}`,
            business: "System", // TODO: Link to actual business if entityType is business
            username: "Admin", // TODO: Link to admin user
            user: "TRND-ADM",
            action: l.action,
            verified: "System",
            riskFlag: null,
            date: new Date(l.createdAt).toLocaleString(),
            details: l.details
        }));
        res.json(formattedLogs);
    });

    // === ADMIN: INVOICES ===
    app.post("/api/admin/invoices/:businessId/generate", async (req, res) => {
        try {
            const businessId = parseInt(req.params.businessId);
            const url = await storage.generateInvoicePDF(businessId);
            // In real app, this might pipe a stream. Here we return a URL.
            res.json({ success: true, url });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/admin/invoices/:businessId/mark-paid", async (req, res) => {
        try {
            const businessId = parseInt(req.params.businessId);
            const account = await storage.markInvoicePaid(businessId);
            res.json({ success: true, account });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === ADMIN: BUSINESS APPROVAL ===

    // Get pending businesses
    app.get("/api/admin/businesses/pending", async (req, res) => {
        try {
            const businesses = await storage.getBusinessAccounts();
            const pending = businesses.filter(b => b.status === "pending_admin_approval");
            res.json(pending);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // Approve business
    app.post("/api/admin/businesses/:id/approve", async (req, res) => {
        try {
            const businessId = parseInt(req.params.id);
            const account = await storage.updateBusinessAccount(businessId, {
                status: "active"
            });
            res.json({ success: true, account });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // Reject business
    app.post("/api/admin/businesses/:id/reject", async (req, res) => {
        try {
            const businessId = parseInt(req.params.id);
            const { reason } = req.body;
            const account = await storage.updateBusinessAccount(businessId, {
                status: "rejected"
            });
            // TODO: Send rejection email with reason
            res.json({ success: true, account, reason });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === ADMIN: STATS ===
    app.get("/api/admin/stats", async (req, res) => {
        try {
            const stats = await storage.getPlatformStats();
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });
}
