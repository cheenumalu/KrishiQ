import { Request, Response } from "express";
import { sendError } from "../utils/apiResponse";

/**
 * 404 Not Found handler for unmatched routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(
    res,
    `Resource not found: ${req.method} ${req.originalUrl}`,
    404
  );
};
