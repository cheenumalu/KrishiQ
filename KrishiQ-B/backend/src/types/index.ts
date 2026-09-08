/**
 * Standard API Success Response Envelope
 */
export interface ApiResponse<T = unknown> {
  success: true;
  message?: string;
  data: T;
}

/**
 * Standard API Error Response Envelope
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
}

/**
 * Health Check Payload
 */
export interface HealthData {
  status: "healthy" | "degraded" | "unhealthy";
  uptimeSeconds: number;
  timestamp: string;
  environment: string;
  version: string;
}

export * from "./auth";

