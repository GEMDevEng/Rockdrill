import os
from typing import List, Optional, Union
from pydantic import validator, Field
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment-specific .env file
env = os.getenv("ENVIRONMENT", "development")
if env == "production":
    load_dotenv(".env.production")
elif env == "staging":
    load_dotenv(".env.staging")
else:
    load_dotenv()


class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Rockdrill API"
    PROJECT_VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=True, description="Enable debug mode")
    ENVIRONMENT: str = Field(default="development", description="Environment: development, staging, production")
    LOG_LEVEL: str = Field(default="INFO", description="Logging level")
    
    # Database Configuration
    DATABASE_URL: str = Field(
        default="sqlite:///./rockdrill.db",
        description="Database connection URL"
    )

    # Redis Configuration
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URL"
    )

    # JWT Configuration
    SECRET_KEY: str = Field(
        default="your-super-secret-jwt-key-change-this-in-production",
        description="JWT secret key - MUST be changed in production"
    )
    ALGORITHM: str = Field(default="HS256", description="JWT algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30, description="Access token expiration in minutes"
    )
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7, description="Refresh token expiration in days"
    )

    # CORS Configuration
    BACKEND_CORS_ORIGINS: Union[List[str], str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:5173",
            "https://rockdrill-348vi04cd-gem-devs-projects.vercel.app"
        ],
        description="Allowed CORS origins"
    )
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Email Configuration
    SENDGRID_API_KEY: Optional[str] = None
    FROM_EMAIL: str = "noreply@rockdrill.com"
    FROM_NAME: str = "Rockdrill"
    
    # External API Keys
    CLEARBIT_API_KEY: Optional[str] = None
    CLAY_API_KEY: Optional[str] = None
    ZOOMINFO_API_KEY: Optional[str] = None
    
    # File Upload Configuration
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_FILE_TYPES: List[str] = ["csv", "xlsx", "xls"]
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    
    # Security
    BCRYPT_ROUNDS: int = 12
    PASSWORD_MIN_LENGTH: int = 8
    
    # Celery Configuration
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()
