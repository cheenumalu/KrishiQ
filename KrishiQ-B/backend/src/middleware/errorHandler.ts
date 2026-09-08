import { Request, Response, NextFunction } from "express";
import { AppError, sendError } from "../utils/apiResponse";
import { config } from "../config/env";

/**
 * Global centralized error-handling middleware
 * Ensures all errors produce a consistent JSON envelope
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Determine HTTP status code
  let statusCode = 500;
  if ("statusCode" in err && typeof err.statusCode === "number") {
    statusCode = err.statusCode;
  } else if ("status" in err && typeof (err as any).status === "number") {
    statusCode = (err as any).status;
  }

  // Handle common JSON parsing syntax error
  if ("type" in err && (err as any).type === "entity.parse.failed") {
    statusCode = 400;
  }

  const message = err.message || "Internal Server Error";
  const stack = config.nodeEnv === "development" ? err.stack : undefined;

  // Log error to console in development
  if (config.nodeEnv === "development") {
    console.error(`[Error Handler] ${err.name || "Error"}: ${message}`);
    if (err.stack) console.error(err.stack);
  }

  sendError(res, message, statusCode, undefined, stack);
};
