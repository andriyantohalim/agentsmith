from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from services.document_service import DocumentService
from services.chat_service import ChatService
from routes import chat_routes, document_routes, health_routes

# Initialize settings
settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="AI chatbot with RAG capabilities",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
document_service = DocumentService()
chat_service = ChatService(document_service)

# Inject services into routes
chat_routes.set_chat_service(chat_service)
document_routes.set_document_service(document_service)
health_routes.set_document_service(document_service)

# Include routers
app.include_router(chat_routes.router)
app.include_router(document_routes.router)
app.include_router(health_routes.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)