import app from "./app";
import { config } from "./config/env";

const server = app.listen(config.port, () => {
  console.log("=================================================");
  console.log(`🌾 KrishiQ Backend Server (SIH26032) is running`);
  console.log(`📡 Port:        ${config.port}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🩺 Health Check: http://localhost:${config.port}${config.apiPrefix}/health`);
  console.log(`🔗 Allowed CORS: ${config.corsOrigins.join(", ")}`);
  console.log("=================================================");
});

// Handle graceful shutdown on process termination signals
const handleGracefulShutdown = (signal: string) => {
  console.log(`\n[${signal}] Received. Shutting down KrishiQ server gracefully...`);
  server.close(() => {
    console.log("✅ Closed all active HTTP connections. Server terminated.");
    process.exit(0);
  });

  // Force close if connections remain hanging
  setTimeout(() => {
    console.error("⚠️ Forced shutdown after 10s timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));
process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));

// Catch unhandled promise rejections and uncaught exceptions
process.on("unhandledRejection", (reason: unknown) => {
  console.error("💥 Unhandled Rejection detected:", reason);
});

process.on("uncaughtException", (error: Error) => {
  console.error("💥 Uncaught Exception detected:", error);
  process.exit(1);
});

export default server;
