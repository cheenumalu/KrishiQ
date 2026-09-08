import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/env";
import { requestLogger } from "./middleware/requestLogger";
import { notFoundHandler } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import apiRoutes from "./routes";

const app: Application = express();

// 1. Security Headers Middleware
app.use(helmet());

// 2. Cross-Origin Resource Sharing (CORS) Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (config.corsOrigins.includes("*") || config.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Body Parsing Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 4. Request Logging Middleware
app.use(requestLogger);

// 5. Root Welcome Route
app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "KrishiQ API Server (SIH26032)",
    documentation: "Refer to BACKEND_REQUIREMENTS.md",
    healthCheck: `${config.apiPrefix}/health`,
  });
});

// 6. Mount Main API Routes
app.use(config.apiPrefix, apiRoutes);

// 7. 404 Catch-All Middleware
app.use(notFoundHandler);

// 8. Global Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
