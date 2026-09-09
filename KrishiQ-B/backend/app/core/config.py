import os
from pathlib import Path
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Explicitly load .env from backend root if it exists
backend_dir = Path(__file__).resolve().parent.parent.parent
env_path = backend_dir / ".env"
if env_path.exists():
    load_dotenv(env_path)

class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "KrishiQ Backend"
    APP_VERSION: str = "2.0.0"
    API_PREFIX: str = Field(default="/api", validation_alias="API_PREFIX")
    ENV: str = Field(default="development", validation_alias="NODE_ENV")
    HOST: str = "0.0.0.0"
    PORT: int = Field(default=5000, validation_alias="PORT")
    
    # CORS
    CORS_ORIGIN: str = Field(default="http://localhost:5173", validation_alias="CORS_ORIGIN")
    
    # Supabase PostgreSQL & Auth
    SUPABASE_URL: str = Field(default="https://your-project-id.supabase.co", validation_alias="SUPABASE_URL")
    SUPABASE_ANON_KEY: str = Field(default="your-supabase-anon-key", validation_alias="SUPABASE_ANON_KEY")
    SUPABASE_SERVICE_ROLE_KEY: str = Field(default="your-supabase-service-role-key", validation_alias="SUPABASE_SERVICE_ROLE_KEY")
    
    # Direct PostgreSQL connection (optional alternative to Supabase REST)
    DATABASE_URL: str = Field(default="", validation_alias="DATABASE_URL")
    
    # Redis Configuration
    REDIS_HOST: str = Field(default="localhost", validation_alias="REDIS_HOST")
    REDIS_PORT: int = Field(default=6379, validation_alias="REDIS_PORT")
    REDIS_PASSWORD: str = Field(default="", validation_alias="REDIS_PASSWORD")
    REDIS_URL: str = Field(default="redis://localhost:6379/0", validation_alias="REDIS_URL")
    
    # Firebase Cloud Messaging & SMS (Phase 8 Preparation)
    FIREBASE_CREDENTIALS_PATH: str = Field(default="", validation_alias="FIREBASE_CREDENTIALS_PATH")
    SMS_GATEWAY_API_KEY: str = Field(default="", validation_alias="SMS_GATEWAY_API_KEY")

    model_config = SettingsConfigDict(
        env_file=str(env_path),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGIN or self.CORS_ORIGIN.strip() == "":
            return ["http://localhost:5173"]
        return [origin.strip() for origin in self.CORS_ORIGIN.split(",") if origin.strip()]

settings = Settings()
