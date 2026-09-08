import { Response } from "express";
import { ApiResponse, ApiErrorResponse } from "../types";

/**
 * Custom application error with HTTP status code support
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Helper to send standardized successful JSON responses
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    ...(message ? { message } : {}),
    data,
  };
  return res.status(statusCode).json(payload);
};

/**
 * Helper to send standardized error JSON responses
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: unknown,
  stack?: string
): Response => {
  const payload: ApiErrorResponse = {
    success: false,
    message,
    ...(errors !== undefined ? { errors } : {}),
    ...(stack ? { stack } : {}),
  };
  return res.status(statusCode).json(payload);
};
