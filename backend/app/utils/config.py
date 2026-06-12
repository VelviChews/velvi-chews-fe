from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str 
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = "HS256"
    DEBUG: bool = True

    BACKEND_URL:str
    FRONTEND_URL:str
    GAS_URL:str
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str

    class Config:
        env_file = ".env"

settings = Settings()
