from typing import List, Optional
from openai import OpenAI
from datetime import datetime
from models.schemas import Message, ChatResponse
from services.document_service import DocumentService
from config import get_settings

class ChatService:
    def __init__(self, document_service: DocumentService):
        self.settings = get_settings()
        self.document_service = document_service
        self.client = OpenAI(
            api_key=self.settings.openai_api_key,
            base_url=self.settings.openai_api_base
        )
    
    def build_system_message(self, context: Optional[str] = None) -> dict:
        """Build the system message for the chat."""
        base_content = "You are AgentSmith, a helpful AI assistant. Be concise, friendly, and informative."
        
        if context:
            base_content += f"\n\nContext from uploaded documents:\n{context}\n\nUse this context to answer the user's question."
        
        return {"role": "system", "content": base_content}
    
    def prepare_messages(
        self,
        user_message: str,
        conversation_history: List[Message],
        use_rag: bool
    ) -> tuple[list, List[str]]:
        """Prepare messages for OpenAI API call."""
        sources = []
        context = None
        
        # If RAG is enabled, retrieve relevant documents
        if use_rag:
            relevant_docs = self.document_service.retrieve_relevant_documents(user_message)
            if relevant_docs:
                context = "\n\n".join([doc.page_content for doc in relevant_docs])
                sources = list(set([
                    doc.metadata.get("source", "Unknown")
                    for doc in relevant_docs
                ]))
        
        # Build messages
        messages = [self.build_system_message(context)]
        
        # Add conversation history (last 10 messages)
        for msg in conversation_history[-10:]:
            messages.append({"role": msg.role, "content": msg.content})
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        return messages, sources
    
    def generate_response(
        self,
        user_message: str,
        conversation_history: List[Message],
        use_rag: bool
    ) -> ChatResponse:
        """Generate a chat response."""
        messages, sources = self.prepare_messages(
            user_message,
            conversation_history,
            use_rag
        )
        
        # Call OpenAI API
        response = self.client.chat.completions.create(
            model=self.settings.model_name,
            messages=messages,
            max_tokens=self.settings.max_tokens,
            temperature=self.settings.temperature
        )
        
        assistant_message = response.choices[0].message.content
        
        return ChatResponse(
            message=assistant_message,
            timestamp=datetime.now().isoformat(),
            sources=sources if sources else None
        )