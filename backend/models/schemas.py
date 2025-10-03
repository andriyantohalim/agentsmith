from pydantic import BaseModel
from typing import Optional, List

class Message(BaseModel):
    role: str
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Message]] = []
    use_rag: Optional[bool] = False

class ChatResponse(BaseModel):
    message: str
    timestamp: str
    sources: Optional[List[str]] = None

class UploadResponse(BaseModel):
    filename: str
    pages: int
    chunks: int
    message: str

class DocumentInfo(BaseModel):
    total_chunks: int
    documents: List[str]

class HealthResponse(BaseModel):
    status: str
    openai_configured: bool
    api_base: str
    documents_loaded: int