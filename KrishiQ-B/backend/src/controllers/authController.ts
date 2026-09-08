import { Request, Response } from "express";
import { ApiResponse } from "../types";
import { AuthenticatedUser } from "../types/auth";

export class AuthController {
  /**
   * GET /api/auth/me
   * Returns current authenticated user profile, role, and details
   */
  public getMe = (req: Request, res: Response): void => {
    const user = req.user as AuthenticatedUser;

    const response: ApiResponse<{ user: AuthenticatedUser }> = {
      success: true,
      message: "Authenticated user profile retrieved successfully",
      data: {
        user,
      },
    };

    res.status(200).json(response);
  };
}

export const authController = new AuthController();
