import type { Express } from "express";
import type { IStorage } from "./storage";
import type { BusinessAccount } from "@shared/schema";

export function registerBusinessRoutes(app: Express, storage: IStorage) {
    // === AUTHENTICATION ===

    app.get("/api/business/me", async (req, res) => {
        try {
            if (!req.isAuthenticated() || (req.user as any).role !== 'business') {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const userId = (req.user as any).id;
            const business = await storage.getBusinessAccountByUserId(userId);

            if (!business) {
                return res.status(404).json({ error: "Business account not found" });
            }

            res.json({ business });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === DASHBOARD METRICS ===

    app.get("/api/business/dashboard", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const metrics = await storage.getBusinessDashboard(placeId);
            res.json(metrics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === MOMENTS & ENGAGEMENT ===

    app.get("/api/business/moments", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const moments = await storage.getVenueMoments(placeId);
            res.json(moments);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/business/moments/:id/report", async (req, res) => {
        try {
            const postId = parseInt(req.params.id);
            const { reason } = req.body;
            await storage.reportPost(postId, reason);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/business/surveys/insights", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const insights = await storage.getSurveyInsights(placeId);
            res.json(insights);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/business/survey-insights", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const insights = await storage.getSurveyInsights(placeId);
            res.json(insights);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === SURVEY MANAGEMENT ===

    app.get("/api/business/surveys", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const surveys = await storage.getBusinessSurveys(placeId);
            res.json(surveys);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/business/surveys", async (req, res) => {
        try {
            const survey = await storage.createSurvey(req.body);
            res.json(survey);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put("/api/business/surveys/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const survey = await storage.updateSurvey(id, req.body);
            res.json(survey);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.delete("/api/business/surveys/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await storage.deleteSurvey(id);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.patch("/api/business/surveys/:id/toggle", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const survey = await storage.toggleSurvey(id);
            res.json(survey);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === TASK MANAGEMENT ===

    app.get("/api/business/tasks", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const tasks = await storage.getBusinessTasks(placeId);
            res.json(tasks);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/business/tasks", async (req, res) => {
        try {
            const task = await storage.createTask(req.body);
            res.json(task);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put("/api/business/tasks/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const task = await storage.updateTask(id, req.body);
            res.json(task);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.delete("/api/business/tasks/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await storage.deleteTask(id);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === REWARD MANAGEMENT ===

    app.get("/api/business/rewards", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const rewards = await storage.getBusinessRewards(placeId);
            res.json(rewards);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/business/rewards", async (req, res) => {
        try {
            const reward = await storage.createReward(req.body);
            res.json(reward);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put("/api/business/rewards/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const reward = await storage.updateReward(id, req.body);
            res.json(reward);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.patch("/api/business/rewards/:id/toggle", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const reward = await storage.toggleReward(id);
            res.json(reward);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/business/rewards/validate", async (req, res) => {
        try {
            const { code, placeId } = req.body;
            // Assuming code is userRewardId for now
            const result = await storage.validateReward(parseInt(code), parseInt(placeId));
            if (!result.valid) {
                return res.status(400).json(result);
            }
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === REPORTS ===

    app.get("/api/business/reports", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const reports = await storage.getBusinessReports(placeId);
            res.json(reports);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === NEW BUSINESS FEATURES ===

    app.get("/api/business/checkins", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const checkins = await storage.getCheckins(placeId);
            res.json(checkins);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/business/checkins", async (req, res) => {
        try {
            const checkin = await storage.createCheckin(req.body);
            res.json(checkin);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/business/analytics/daily", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const metrics = await storage.getBusinessDailyMetrics(placeId);
            res.json(metrics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/business/analytics/daily", async (req, res) => {
        try {
            const metric = await storage.createBusinessDailyMetric(req.body);
            res.json(metric);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/business/exports", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const exports = await storage.getReportExports(placeId);
            res.json(exports);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/business/exports", async (req, res) => {
        try {
            const placeId = parseInt(req.body.placeId || req.query.placeId);
            const type = req.body.type || "PDF";

            // Use the new generate logic which includes logging
            const result = await storage.generateExport(placeId, type);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/business/audit-logs", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const logs = await storage.getBusinessAuditLogs(placeId);
            res.json(logs);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/business/customers", async (req, res) => {
        try {
            const placeId = parseInt(req.query.placeId as string);
            const customers = await storage.getBusinessCustomers(placeId);
            res.json(customers);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get("/api/business/account/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const account = await storage.getBusinessAccount(id);
            if (!account) return res.status(404).json({ error: "Account not found" });
            res.json(account);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put("/api/business/account/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const updated = await storage.updateBusinessAccount(id, req.body);
            res.json(updated);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // === ANALYTICS & BILLING ===
    app.get("/api/business/invoices", async (req, res) => {
        try {
            const businessId = parseInt(req.query.businessId as string);
            if (!businessId) return res.status(400).json({ error: "businessId required" });
            const invoices = await storage.getInvoices(businessId);
            res.json(invoices);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/business/subscription/manage", async (req, res) => {
        try {
            const { businessId, plan } = req.body;
            const updated = await storage.updateSubscription(businessId, plan);
            res.json(updated);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/business/payment-methods", async (req, res) => {
        try {
            const { businessId, details } = req.body;
            const updated = await storage.addPaymentMethod(businessId, details);
            res.json(updated);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });
}
