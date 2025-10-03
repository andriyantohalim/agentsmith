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
            base_content = f"""You are AgentSmith, a helpful AI assistant.

IMPORTANT: Answer the user's question ONLY based on the following context from the uploaded documents. If the answer is not in the context, say "I don't find that information in the uploaded documents."

Context:
{context}

Instructions:
- Use only the information from the context above
- Be specific and cite relevant parts
- If unsure, acknowledge it
- Keep answers concise and direct"""
        
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
                # Build context with more detail
                context_parts = []
                for i, doc in enumerate(relevant_docs, 1):
                    context_parts.append(f"[Excerpt {i}]:\n{doc.page_content}")
                
                context = "\n\n".join(context_parts)
                sources = list(set([
                    doc.metadata.get("source", "Unknown")
                    for doc in relevant_docs
                ]))
                
                # Debug logging
                print(f"\n{'='*50}")
                print(f"RAG Query: {user_message}")
                print(f"Found {len(relevant_docs)} relevant documents")
                print(f"Sources: {sources}")
                print(f"Context length: {len(context)} characters")
                print(f"Context preview: {context[:500]}...")
                print(f"{'='*50}\n")
        
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