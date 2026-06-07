from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    MONGO_URL: str
    MONGO_DB_NAME: str = "profit_guard_db"
    FRONTEND_URLS: list = ["http://localhost:3000"]
    class Config:
        env_file = ".env"
settings = Settings()