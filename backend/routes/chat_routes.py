from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from services.chat_service import ChatService
from services.document_service import DocumentService

router = APIRouter(prefix="/chat", tags=["chat"])

# This will be injected
chat_service: ChatService = None

def set_chat_service(service: ChatService):
    global chat_service
    chat_service = service

@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a message to the chatbot."""
    try:
        return chat_service.generate_response(
            user_message=request.message,
            conversation_history=request.conversation_history,
            use_rag=request.use_rag
        )
    except Exception as e:
        error_msg = str(e)
        print(f"ERROR in chat: {error_msg}")
        
        if "authentication" in error_msg.lower():
            raise HTTPException(status_code=401, detail="Invalid OpenAI API key")
        elif "rate" in error_msg.lower():
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        else:
            raise HTTPException(status_code=500, detail=f"Error: {error_msg}")