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
    
    def build_system_prompt(self, context: Optional[str] = None) -> str:
        """Build the system prompt."""
        base = "You are AgentSmith, a helpful AI assistant. Be concise, friendly, and informative."
        
        if not context:
            return base
        
        return f"""{base}

IMPORTANT: Answer based ONLY on this context from the uploaded documents.
If the answer isn't in the context, say "I don't find that information in the documents."

Context:
{context}

Instructions:
- Use only the context above
- Be specific and cite relevant parts
- Keep answers concise"""
    
    def get_rag_context(self, query: str) -> tuple[Optional[str], List[str]]:
        """Get RAG context and sources for a query."""
        docs = self.document_service.retrieve_relevant_documents(query)
        
        if not docs:
            return None, []
        
        context = "\n\n".join(
            f"[Excerpt {i}]:\n{doc.page_content}"
            for i, doc in enumerate(docs, 1)
        )
        
        sources = list(set(
            doc.metadata.get("source", "Unknown") 
            for doc in docs
        ))
        
        return context, sources
    
    def build_messages(
        self,
        user_message: str,
        history: List[Message],
        use_rag: bool
    ) -> tuple[list, List[str]]:
        """Build messages for OpenAI API."""
        context, sources = None, []
        
        if use_rag:
            context, sources = self.get_rag_context(user_message)
        
        messages = [
            {"role": "system", "content": self.build_system_prompt(context)},
            *[{"role": msg.role, "content": msg.content} for msg in history[-10:]],
            {"role": "user", "content": user_message}
        ]
        
        return messages, sources
    
    def generate_response(
        self,
        user_message: str,
        conversation_history: List[Message],
        use_rag: bool
    ) -> ChatResponse:
        """Generate a chat response."""
        messages, sources = self.build_messages(user_message, conversation_history, use_rag)
        
        response = self.client.chat.completions.create(
            model=self.settings.model_name,
            messages=messages,
            max_tokens=self.settings.max_tokens,
            temperature=self.settings.temperature
        )
        
        return ChatResponse(
            message=response.choices[0].message.content,
            timestamp=datetime.now().isoformat(),
            sources=sources if sources else None
        )