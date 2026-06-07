# backend/app/core/config.py
import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "Profit Guard API"
    DEBUG: bool = True
    UPLOAD_DIR: str = "backend/data/uploads"
    
    # Database Settings loaded from .env
    MONGO_URL: str
    MONGO_DB_NAME: str = "profit_guard_db"
    
    # Security / CORS (Comma separated list in .env)
    FRONTEND_URLS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()