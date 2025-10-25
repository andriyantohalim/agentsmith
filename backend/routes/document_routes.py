from fastapi import APIRouter, HTTPException, UploadFile, File
from models.schemas import UploadResponse, DocumentInfo, HealthResponse
from services.document_service import DocumentService
from config import get_settings
import os

router = APIRouter(prefix="/documents", tags=["documents"])

document_service: DocumentService = None

def set_document_service(service: DocumentService):
    global document_service
    document_service = service

@router.post("/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process a PDF file."""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    temp_path = f"temp_{file.filename}"
    
    try:
        # Save file
        content = await file.read()
        with open(temp_path, "wb") as f:
            f.write(content)
        
        # Process PDF
        pages, chunks = document_service.process_pdf(temp_path, file.filename)
        
        return UploadResponse(
            filename=file.filename,
            pages=pages,
            chunks=chunks,
            message=f"Successfully processed {file.filename}"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
    
    finally:
        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.get("", response_model=DocumentInfo)
async def get_documents():
    """Get uploaded documents info."""
    return document_service.get_document_info()

@router.delete("")
async def clear_documents():
    """Clear all documents."""
    document_service.clear_all_documents()
    return {"message": "Documents cleared"}

@router.get("/info")
async def root():
    """Root endpoint."""
    settings = get_settings()
    provider = "Ollama" if settings.is_ollama else "OpenAI"
    return {
        "message": settings.app_name,
        "status": "online",
        "provider": provider,
        "model": settings.model_name
    }

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check."""
    settings = get_settings()
    doc_info = document_service.get_document_info()
    
    return HealthResponse(
        status="healthy",
        openai_configured=bool(settings.openai_api_key) or settings.is_ollama,
        api_base=settings.ollama_base_url if settings.is_ollama else settings.openai_api_base,
        documents_loaded=doc_info["total_chunks"]
    )