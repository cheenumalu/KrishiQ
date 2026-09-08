import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/auth";

/**
 * Role-Based Access Control (RBAC) Middleware Factory
 * Enforces that the authenticated user possesses at least one of the specified roles.
 * Must always be used AFTER authMiddleware in the route pipeline.
 *
 * @param allowedRoles One or more permitted UserRole strings ('farmer', 'centre', 'admin')
 * @returns Express middleware function
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // 1. Ensure user has passed authentication middleware
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required before role verification.",
      });
      return;
    }

    // 2. Check if user's role is permitted
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Insufficient role permissions. Required: [${allowedRoles.join(
          ", "
        )}]. Your role: '${req.user.role}'.`,
      });
      return;
    }

    next();
  };
};
