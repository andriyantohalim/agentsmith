from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from datetime import datetime
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
import traceback

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
from openai import OpenAI
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
)

# Global vector store
vector_store = None
uploaded_documents = []

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

@app.get("/")
async def root():
    return {"message": "AgentSmith Chatbot API", "status": "online"}

@app.post("/upload-pdf", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    global vector_store, uploaded_documents
    
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
        
        # Extract text from PDF
        print("Extracting text from PDF...")
        pdf_reader = PdfReader(temp_file_path)
        text = ""
        for i, page in enumerate(pdf_reader.pages):
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
            print(f"Processed page {i+1}/{len(pdf_reader.pages)}")
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text content found in PDF")
        
        print(f"Extracted {len(text)} characters of text")
        
        # Split text into chunks
        print("Splitting text into chunks...")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        
        chunks = text_splitter.split_text(text)
        print(f"Created {len(chunks)} chunks")
        
        # Create documents
        documents = [Document(page_content=chunk, metadata={"source": file.filename}) for chunk in chunks]
        uploaded_documents.extend(documents)
        
        print("Creating embeddings...")
        # Create or update vector store
        embeddings = OpenAIEmbeddings(
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        if vector_store is None:
            print("Creating new vector store...")
            vector_store = FAISS.from_documents(documents, embeddings)
        else:
            print("Adding to existing vector store...")
            vector_store.add_documents(documents)
        
        print("Vector store updated successfully")
        
        # Clean up temp file
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            print(f"Cleaned up temp file: {temp_file_path}")
        
        response = UploadResponse(
            filename=file.filename,
            pages=len(pdf_reader.pages),
            chunks=len(chunks),
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

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    global vector_store
    
    try:
        # Build messages for OpenAI API
        messages = [
            {"role": "system", "content": "You are AgentSmith, a helpful AI assistant. Be concise, friendly, and informative."}
        ]
        
        sources = []
        
        # If RAG is enabled and we have documents
        if request.use_rag and vector_store is not None:
            # Retrieve relevant documents
            retriever = vector_store.as_retriever(search_kwargs={"k": 3})
            relevant_docs = retriever.get_relevant_documents(request.message)
            
            # Build context from retrieved documents
            context = "\n\n".join([doc.page_content for doc in relevant_docs])
            sources = list(set([doc.metadata.get("source", "Unknown") for doc in relevant_docs]))
            
            # Add context to system message
            messages[0]["content"] += f"\n\nContext from uploaded documents:\n{context}\n\nUse this context to answer the user's question."
        
        # Add conversation history
        for msg in request.conversation_history[-10:]:
            messages.append({"role": msg.role, "content": msg.content})
        
        # Add current user message
        messages.append({"role": "user", "content": request.message})
        
        # Call OpenAI API using new client
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        assistant_message = response.choices[0].message.content
        
        return ChatResponse(
            message=assistant_message,
            timestamp=datetime.now().isoformat(),
            sources=sources if sources else None
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

@app.get("/documents")
async def get_documents():
    global uploaded_documents
    
    # Get unique document sources
    sources = list(set([doc.metadata.get("source", "Unknown") for doc in uploaded_documents]))
    
    return {
        "total_chunks": len(uploaded_documents),
        "documents": sources
    }

@app.delete("/documents")
async def clear_documents():
    global vector_store, uploaded_documents
    
    vector_store = None
    uploaded_documents = []
    
    return {"message": "All documents cleared"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "api_base": os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1"),
        "documents_loaded": len(uploaded_documents)
    }