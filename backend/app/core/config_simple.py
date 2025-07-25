"""
Simple configuration for database setup and testing.
This is a minimal version without all the complex dependencies.
"""

import os
from typing import Optional

class Settings:
    """Simple settings class for database configuration"""
    
    # Database configuration
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://rockdrill_user:rockdrill_password@localhost:5432/rockdrill_db"
    )
    
    # Basic app configuration
    PROJECT_NAME: str = "Rockdrill API"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # CORS
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173", 
        "https://rockdrill-rnzl5r01q-gem-devs-projects.vercel.app"
    ]

# Create settings instance
settings = Settings()
