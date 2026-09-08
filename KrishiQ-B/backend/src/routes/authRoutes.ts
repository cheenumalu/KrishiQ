import { Router } from "express";
import { authController } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * GET /api/auth/me
 * Protected endpoint returning the authenticated user's profile and role.
 */
router.get("/me", authMiddleware, authController.getMe);

export default router;
