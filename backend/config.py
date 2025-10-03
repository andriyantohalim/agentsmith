from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    openai_api_key: str
    openai_api_base: str = "https://api.openai.com/v1"
    
    # App settings
    app_name: str = "AgentSmith Chatbot API"
    cors_origins: list = ["http://localhost:5173"]
    
    # RAG settings
    chunk_size: int = 1000
    chunk_overlap: int = 200
    batch_size: int = 100
    max_retrieval_docs: int = 3
    
    # Model settings
    model_name: str = "gpt-3.5-turbo"
    max_tokens: int = 500
    temperature: float = 0.7
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings():
    return Settings()