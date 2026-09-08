import dotenv from "dotenv";
import path from "path";

// Load .env file from backend root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export interface AppConfig {
  port: number;
  nodeEnv: "development" | "production" | "test";
  apiPrefix: string;
  corsOrigins: string[];
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
}

const parseCorsOrigins = (rawOrigins?: string): string[] => {
  if (!rawOrigins || rawOrigins.trim() === "") {
    return ["http://localhost:5173"]; // Default to Vite dev server
  }
  return rawOrigins.split(",").map((origin) => origin.trim());
};

export const config: AppConfig = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: (process.env.NODE_ENV as AppConfig["nodeEnv"]) || "development",
  apiPrefix: process.env.API_PREFIX || "/api",
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),
  supabaseUrl: process.env.SUPABASE_URL || "https://placeholder-project.supabase.co",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "placeholder-anon-key",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};
