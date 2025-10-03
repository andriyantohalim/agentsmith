from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])

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
        error_msg = str(e).lower()
        
        if "authentication" in error_msg:
            raise HTTPException(status_code=401, detail="Invalid API key")
        if "rate" in error_msg:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        raise HTTPException(status_code=500, detail=str(e))