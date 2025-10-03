from fastapi import APIRouter
from models.schemas import HealthResponse
from services.document_service import DocumentService
from config import get_settings

router = APIRouter(tags=["health"])

# This will be injected
document_service: DocumentService = None

def set_document_service(service: DocumentService):
    global document_service
    document_service = service

@router.get("/")
async def root():
    """Root endpoint."""
    settings = get_settings()
    return {"message": settings.app_name, "status": "online"}

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check API health and configuration."""
    settings = get_settings()
    doc_info = document_service.get_document_info()
    
    return HealthResponse(
        status="healthy",
        openai_configured=bool(settings.openai_api_key),
        api_base=settings.openai_api_base,
        documents_loaded=doc_info["total_chunks"]
    )