import { Request, Response, NextFunction } from "express";
import { HealthService } from "../services/healthService";
import { sendSuccess } from "../utils/apiResponse";

export class HealthController {
  /**
   * Handles GET /api/health requests
   */
  public static getHealth(_req: Request, res: Response, next: NextFunction): void {
    try {
      const healthData = HealthService.getHealthStatus();
      sendSuccess(res, healthData, "KrishiQ Backend API is running healthy");
    } catch (error) {
      next(error);
    }
  }
}
