import { Request, Response, NextFunction } from "express";

/**
 * Middleware to enforce role-based access control
 * @param allowedRoles - Array of roles that are allowed to access the route
 * @returns Express middleware function
 */
export function requireRole(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        // Check if user is authenticated
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized - Please log in" });
        }

        // Check if user has required role
        const user = req.user as any;
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: "Forbidden - You do not have permission to access this resource",
                requiredRole: allowedRoles,
                yourRole: user.role
            });
        }

        // User is authenticated and has correct role
        next();
    };
}
