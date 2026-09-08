import { Router } from "express";
import healthRoutes from "./healthRoutes";
import authRoutes from "./authRoutes";

const router = Router();

// Mount health routes under /health
router.use("/health", healthRoutes);

// Mount authentication routes under /auth
router.use("/auth", authRoutes);

// Future API routes will be mounted here in subsequent phases:
// router.use("/farmer", farmerRoutes);
// router.use("/centre", centreRoutes);
// router.use("/admin", adminRoutes);

export default router;
