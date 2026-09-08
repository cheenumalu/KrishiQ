import { Router } from "express";
import { HealthController } from "../controllers/healthController";

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Health-check probe endpoint returning server status
 * @access  Public
 */
router.get("/", HealthController.getHealth);

export default router;
