import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User, InsertUser } from "@shared/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "./email";
import { z } from "zod";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresStore = connectPg(session);

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || "trendle_secret_key",
        resave: false,
        saveUninitialized: false,
        store: new PostgresStore({
            pool,
            tableName: "sessions",
            createTableIfMissing: true,
        }),
        cookie: {
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }
    };

    app.set("trust proxy", 1);
    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await storage.getUserByUsername(username);
                if (!user) {
                    return done(null, false, { message: "Incorrect username or password." });
                }

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    return done(null, false, { message: "Incorrect username or password." });
                }

                // Block login if email not verified
                if (!user.emailVerified) {
                    return done(null, false, { message: "Please verify your email before logging in." });
                }

                // Block login if account is suspended
                if (user.status === "suspended") {
                    return done(null, false, { message: "Your account has been suspended. Contact support." });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, (user as User).id);
    });

    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await storage.getUser(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    // === UNIFIED AUTH ROUTES ===

    // Unified Login
    app.post("/api/login", (req, res, next) => {
        passport.authenticate("local", (err: any, user: User, info: any) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ message: info?.message || "Login failed" });
            }
            req.login(user, (loginErr) => {
                if (loginErr) return next(loginErr);

                // Determine redirect based on role
                let redirect = "/home";
                if (user.role === "business") redirect = "/business/dashboard";
                if (user.role === "admin") redirect = "/admin/dashboard";

                return res.json({
                    message: "Login successful",
                    user,
                    redirect
                });
            });
        })(req, res, next);
    });

    // Unified Logout
    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    // Get Current User
    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(req.user);
    });

    // User Registration
    app.post("/api/register", async (req, res, next) => {
        try {
            const { username, password, email, phoneNumber } = req.body;

            if (!username || !password || !email || !phoneNumber) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const existingUser = await storage.getUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }

            // Check email uniqueness locally (simplified)
            const allUsers = await storage.getUsers();
            if (allUsers.some(u => u.email === email)) {
                return res.status(400).json({ message: "Email already registered" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationToken = crypto.randomBytes(32).toString('hex');
            // Fix: explicit casting or simpler date math
            const verificationTokenExpiry = new Date();
            verificationTokenExpiry.setDate(verificationTokenExpiry.getDate() + 1);

            const user = await storage.createUser({
                username,
                email,
                phoneNumber,
                password: hashedPassword,
                role: "user",
                status: "pending_verification",
                emailVerified: false,
                verificationToken,
                verificationTokenExpiry,
                avatar: `https://ui-avatars.com/api/?name=${username}&background=random`
            });

            try {
                await sendVerificationEmail(email, verificationToken, 'user');
            } catch (error) {
                console.error("Failed to send verification email", error);
                // In production might want to rollback user creation
            }

            res.status(201).json({ message: "Registration successful. Please check your email." });
        } catch (err) {
            next(err);
        }
    });

    // Business Registration (Unified Flow)
    app.post("/api/business/register", async (req, res, next) => {
        try {
            const {
                username, password, email, phoneNumber, // User fields
                businessName, city, category, contactPerson // Business fields
            } = req.body;

            if (!username || !password || !email || !businessName || !city || !category) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const existingUser = await storage.getUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }

            const allUsers = await storage.getUsers();
            if (allUsers.some(u => u.email === email)) {
                return res.status(400).json({ message: "Email already registered" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationTokenExpiry = new Date();
            verificationTokenExpiry.setDate(verificationTokenExpiry.getDate() + 1);

            // 1. Create User (Role: Business)
            const user = await storage.createUser({
                username,
                email,
                phoneNumber,
                password: hashedPassword,
                role: "business",
                status: "pending_verification",
                emailVerified: false,
                verificationToken,
                verificationTokenExpiry,
                avatar: `https://ui-avatars.com/api/?name=${businessName}&background=random`
            });

            // 2. Create Business Profile
            await storage.createBusinessAccount({
                userId: user.id,
                businessName,
                contactPerson: contactPerson || username,
                contactEmail: email,
                contactPhone: phoneNumber,
                city,
                category,
                placeId: 0, // Placeholder
                status: "active" // Profile is active, but User login depends on email verification
            });

            try {
                await sendVerificationEmail(email, verificationToken, 'business');
            } catch (error) {
                console.error("Failed to send verification email", error);
            }

            res.status(201).json({ message: "Business registration successful. Please check your email." });
        } catch (err) {
            next(err);
        }
    });

    // Unified Verification Endpoint
    app.get("/verify-email", async (req, res) => {
        const { token } = req.query;

        if (!token || typeof token !== 'string') {
            return res.status(400).send("Invalid token");
        }

        const users = await storage.getUsers();
        const user = users.find(u => u.verificationToken === token);

        if (!user) {
            return res.status(400).send("Invalid or expired verification link.");
        }

        await storage.updateUser(user.id, {
            emailVerified: true,
            status: "active",
            verificationToken: null,
            verificationTokenExpiry: null
        });

        // Auto-login after verification
        req.login(user, (err) => {
            if (err) {
                console.error("Auto-login failed after verification:", err);
                return res.redirect("/auth?verified=true");
            }

            // Strict Role-Based Redirect
            if (user.role === "business") {
                return res.redirect("/business/onboarding");
            } else if (user.role === "admin") {
                return res.redirect("/admin/dashboard");
            } else {
                return res.redirect("/home");
            }
        });
    });
}
