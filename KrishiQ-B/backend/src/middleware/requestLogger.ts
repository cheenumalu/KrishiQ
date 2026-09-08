import morgan from "morgan";
import { config } from "../config/env";

/**
 * HTTP request logger middleware
 * Uses concise 'dev' format in development and standard 'combined' format in production
 */
export const requestLogger = morgan(
  config.nodeEnv === "development" ? "dev" : "combined"
);
