from fastapi import APIRouter, HTTPException, UploadFile, File
from models.schemas import UploadResponse, DocumentInfo
from services.document_service import DocumentService
import os
import traceback

router = APIRouter(prefix="/documents", tags=["documents"])

# This will be injected
document_service: DocumentService = None

def set_document_service(service: DocumentService):
    global document_service
    document_service = service

@router.post("/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process a PDF file."""
    temp_file_path = None
    
    try:
        print(f"Starting upload for file: {file.filename}")
        
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Save uploaded file temporarily
        temp_file_path = f"temp_{file.filename}"
        print(f"Saving to: {temp_file_path}")
        
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        print(f"File saved, size: {len(content)} bytes")
        
        # Process PDF
        page_count, chunk_count = document_service.process_pdf(temp_file_path, file.filename)
        
        # Clean up temp file
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            print(f"Cleaned up temp file: {temp_file_path}")
        
        response = UploadResponse(
            filename=file.filename,
            pages=page_count,
            chunks=chunk_count,
            message=f"Successfully processed {file.filename}"
        )
        
        print(f"Upload complete: {response}")
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        # Print full stack trace
        print(f"ERROR in upload_pdf: {str(e)}")
        print(traceback.format_exc())
        
        # Clean up temp file if it exists
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@router.get("", response_model=DocumentInfo)
async def get_documents():
    """Get information about uploaded documents."""
    return document_service.get_document_info()

@router.delete("")
async def clear_documents():
    """Clear all uploaded documents."""
    document_service.clear_all_documents()
    return {"message": "All documents cleared"}