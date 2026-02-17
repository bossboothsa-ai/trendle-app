import type {
    User, Post, Comment, Like, Cashout, DeviceFingerprint, ImageHash, FraudFlag, UserDailyLimit
} from "@shared/schema";

// ===== TYPES =====

export interface FraudCheckResult {
    allowed: boolean;
    reason?: string;
    severity?: "low" | "medium" | "high";
    pointsToAward?: number;
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export interface CheckInContext {
    userId: number;
    placeId: number;
    userLocation: GeoLocation;
    placeLocation: GeoLocation;
    checkedInAt: Date;
    postCreatedAt: Date;
}

// ===== ANTI-FRAUD GUARD SERVICE =====

export class AntiFraudGuard {
    // === ACCOUNT PROTECTION ===

    static validatePhoneVerification(user: User): FraudCheckResult {
        if (!user.phoneVerified) {
            return {
                allowed: false,
                reason: "Phone verification required to earn points",
                severity: "low"
            };
        }
        return { allowed: true };
    }

    static async checkDeviceLimit(
        userId: number,
        deviceId: string,
        deviceFingerprints: DeviceFingerprint[]
    ): Promise<FraudCheckResult> {
        const devicesForUser = deviceFingerprints.filter(d => d.userId === userId);

        if (devicesForUser.length >= 3 && !devicesForUser.some(d => d.deviceId === deviceId)) {
            return {
                allowed: false,
                reason: "Maximum device limit reached (3 devices per account)",
                severity: "medium"
            };
        }

        return { allowed: true };
    }

    static checkDuplicatePayoutDetails(
        userId: number,
        payoutDetails: any,
        allCashouts: Cashout[]
    ): FraudCheckResult {
        // Check if same bank account or mobile number used by different user
        const duplicates = allCashouts.filter(c => {
            if (c.userId === userId) return false;
            const details = c.details as any;
            return (
                (payoutDetails.accountNumber && details.accountNumber === payoutDetails.accountNumber) ||
                (payoutDetails.mobileNumber && details.mobileNumber === payoutDetails.mobileNumber)
            );
        });

        if (duplicates.length > 0) {
            return {
                allowed: false,
                reason: "Payout details already used by another account",
                severity: "high"
            };
        }

        return { allowed: true };
    }

    // === CHECK-IN VALIDATION ===

    static validateCheckInRadius(
        userLocation: GeoLocation,
        placeLocation: GeoLocation,
        radiusMeters: number = 100
    ): FraudCheckResult {
        const distance = this.calculateDistance(userLocation, placeLocation);

        if (distance > radiusMeters) {
            return {
                allowed: false,
                reason: `You must be within ${radiusMeters}m of the venue to check in (${Math.round(distance)}m away)`,
                severity: "medium"
            };
        }

        return { allowed: true };
    }

    static calculatePointsBasedOnTime(
        checkedInAt: Date,
        postCreatedAt: Date,
        basePoints: number = 50
    ): FraudCheckResult {
        const timeDiffMinutes = (postCreatedAt.getTime() - checkedInAt.getTime()) / (1000 * 60);

        // Must post within 24 hours
        if (timeDiffMinutes > 24 * 60) {
            return {
                allowed: false,
                reason: "Moment must be posted within 24 hours of check-in",
                severity: "low"
            };
        }

        // Full points if within 30 minutes
        if (timeDiffMinutes <= 30) {
            return {
                allowed: true,
                pointsToAward: basePoints,
            };
        }

        // Reduced points after 30 minutes (50% reduction)
        return {
            allowed: true,
            pointsToAward: Math.floor(basePoints * 0.5),
        };
    }

    static checkDuplicateCheckIn(
        userId: number,
        placeId: number,
        posts: Post[]
    ): FraudCheckResult {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayCheckIns = posts.filter(p =>
            p.userId === userId &&
            p.placeId === placeId &&
            p.pointsAwarded > 0 &&
            new Date(p.createdAt) >= today
        );

        if (todayCheckIns.length > 0) {
            return {
                allowed: false,
                reason: "You've already earned points for checking in here today",
                severity: "low"
            };
        }

        return { allowed: true };
    }

    // === IMAGE PROTECTION ===

    static generateImageHash(imageUrl: string): string {
        // Simple hash based on URL (in production, use perceptual hashing)
        let hash = 0;
        for (let i = 0; i < imageUrl.length; i++) {
            const char = imageUrl.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }

    static checkDuplicateImage(
        imageHash: string,
        userId: number,
        imageHashes: ImageHash[]
    ): FraudCheckResult {
        const duplicate = imageHashes.find(h => h.hash === imageHash);

        if (duplicate) {
            if (duplicate.userId === userId) {
                return {
                    allowed: false,
                    reason: "You've already posted this image",
                    severity: "low"
                };
            } else {
                return {
                    allowed: false,
                    reason: "This image has been posted by another user",
                    severity: "high" // Cross-account duplicate is more suspicious
                };
            }
        }

        return { allowed: true };
    }

    // === SOCIAL FARMING PREVENTION ===

    static async checkDailyLikeLimit(
        userId: number,
        dailyLimits: UserDailyLimit[]
    ): Promise<FraudCheckResult> {
        const today = new Date().toISOString().split('T')[0];
        const limit = dailyLimits.find(l => l.userId === userId && l.date === today);

        const currentCount = limit?.likesCount || 0;
        if (currentCount >= 100) {
            return {
                allowed: false,
                reason: "Daily like limit reached (100 likes per day)",
                severity: "low"
            };
        }

        return { allowed: true };
    }

    static async checkDailyCommentLimit(
        userId: number,
        dailyLimits: UserDailyLimit[]
    ): Promise<FraudCheckResult> {
        const today = new Date().toISOString().split('T')[0];
        const limit = dailyLimits.find(l => l.userId === userId && l.date === today);

        const currentCount = limit?.commentsCount || 0;
        if (currentCount >= 100) {
            return {
                allowed: false,
                reason: "Daily comment limit reached (100 comments per day)",
                severity: "low"
            };
        }

        return { allowed: true };
    }

    static validateCommentLength(text: string): FraudCheckResult {
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);

        if (words.length <= 3) {
            return {
                allowed: false,
                reason: "Comments must contain more than 3 words to earn points",
                severity: "low"
            };
        }

        return { allowed: true };
    }

    static detectRepeatedText(
        text: string,
        recentComments: Comment[]
    ): FraudCheckResult {
        const normalizedText = text.toLowerCase().trim();

        const duplicates = recentComments.filter(c =>
            c.text.toLowerCase().trim() === normalizedText
        );

        if (duplicates.length >= 3) {
            return {
                allowed: false,
                reason: "Repeated comment text detected",
                severity: "medium"
            };
        }

        return { allowed: true };
    }

    // === CASHOUT PROTECTION ===

    static validateCashoutThreshold(amount: number, minimum: number = 500): FraudCheckResult {
        if (amount < minimum) {
            return {
                allowed: false,
                reason: `Minimum cashout is ${minimum} points`,
                severity: "low"
            };
        }

        return { allowed: true };
    }

    static checkCashoutCooldown(
        userId: number,
        cashouts: Cashout[],
        cooldownDays: number = 7
    ): FraudCheckResult {
        const userCashouts = cashouts
            .filter(c => c.userId === userId && c.status !== "rejected")
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (userCashouts.length === 0) {
            return { allowed: true };
        }

        const lastCashout = userCashouts[0];
        const daysSinceLastCashout = (Date.now() - new Date(lastCashout.createdAt).getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceLastCashout < cooldownDays) {
            const daysRemaining = Math.ceil(cooldownDays - daysSinceLastCashout);
            return {
                allowed: false,
                reason: `You can request another cashout in ${daysRemaining} day(s)`,
                severity: "low"
            };
        }

        return { allowed: true };
    }

    static checkFlaggedAccount(user: User): FraudCheckResult {
        if (user.isFlagged) {
            return {
                allowed: false,
                reason: user.flagReason || "Account is under review",
                severity: "high"
            };
        }

        return { allowed: true };
    }

    // === UTILITY FUNCTIONS ===

    static calculateDistance(loc1: GeoLocation, loc2: GeoLocation): number {
        // Haversine formula
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (loc1.latitude * Math.PI) / 180;
        const φ2 = (loc2.latitude * Math.PI) / 180;
        const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
        const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    static createFraudLog(
        userId: number,
        action: string,
        result: FraudCheckResult
    ): Partial<FraudFlag> {
        if (result.allowed) return {};

        return {
            userId,
            reason: `${action}: ${result.reason}`,
            severity: result.severity || "low",
            resolved: false,
        };
    }

    // === ATOMIC POINTS AWARDING ===

    static async awardPointsAtomically(
        userId: number,
        amount: number,
        reason: string,
        uniqueKey: string, // e.g., "like-post-123-user-1"
        pointsHistory: any[],
        pointsHistoryIdCounter: number
    ): Promise<{ success: boolean; points: number; error?: string }> {
        // Check if points already awarded for this action
        const existing = pointsHistory.find(p =>
            p.userId === userId &&
            p.reason === reason &&
            p.uniqueKey === uniqueKey
        );

        if (existing) {
            return {
                success: false,
                points: 0,
                error: "Points already awarded for this action"
            };
        }

        // Award points
        const newEntry = {
            id: pointsHistoryIdCounter,
            userId,
            amount,
            reason,
            uniqueKey,
            createdAt: new Date()
        };

        pointsHistory.push(newEntry);

        return {
            success: true,
            points: amount
        };
    }
}
