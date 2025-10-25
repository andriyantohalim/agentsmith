from typing import List, Optional
from langchain.schema import Document
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_community.embeddings import OllamaEmbeddings
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from config import get_settings

class DocumentService:
    def __init__(self):
        self.settings = get_settings()
        self.vector_store: Optional[FAISS] = None
        self.uploaded_documents: List[Document] = []
        
        # Use Ollama embeddings or OpenAI embeddings
        if self.settings.is_ollama:
            self.embeddings = OllamaEmbeddings(
                base_url=self.settings.ollama_base_url,
                model=self.settings.model_name
            )
            print(f"🦙 Using Ollama embeddings with {self.settings.model_name}")
        else:
            self.embeddings = OpenAIEmbeddings(
                api_key=self.settings.openai_api_key
            )
            print(f"🤖 Using OpenAI embeddings")
    
    def extract_text_from_pdf(self, file_path: str) -> tuple[str, int]:
        """Extract text from PDF file."""
        pdf_reader = PdfReader(file_path)
        text = "\n".join(
            page.extract_text() or "" 
            for page in pdf_reader.pages
        )
        return text, len(pdf_reader.pages)
    
    def create_chunks(self, text: str, filename: str) -> List[Document]:
        """Split text into chunks and create Document objects."""
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.settings.chunk_size,
            chunk_overlap=self.settings.chunk_overlap,
            separators=["\n\n", "\n", " ", ""]
        )
        
        chunks = splitter.split_text(text)
        
        return [
            Document(
                page_content=chunk.strip(),
                metadata={"source": filename, "chunk_id": i}
            )
            for i, chunk in enumerate(chunks) if chunk.strip()
        ]
    
    def add_to_vector_store(self, documents: List[Document]) -> None:
        """Add documents to vector store in batches."""
        batch_size = self.settings.batch_size
        
        if self.vector_store is None:
            # Create new store with first batch
            self.vector_store = FAISS.from_documents(
                documents[:batch_size], 
                self.embeddings
            )
            documents = documents[batch_size:]
        
        # Add remaining documents in batches
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i + batch_size]
            self.vector_store.add_documents(batch)
    
    def process_pdf(self, file_path: str, filename: str) -> tuple[int, int]:
        """Process PDF file and add to vector store."""
        # Extract text
        text, page_count = self.extract_text_from_pdf(file_path)
        
        if not text.strip():
            raise ValueError("No text content found in PDF")
        
        # Create chunks and documents
        documents = self.create_chunks(text, filename)
        self.uploaded_documents.extend(documents)
        
        # Add to vector store
        self.add_to_vector_store(documents)
        
        return page_count, len(documents)
    
    def retrieve_relevant_documents(self, query: str, k: int = None) -> List[Document]:
        """Retrieve relevant documents using similarity search."""
        if not self.vector_store:
            return []
        
        k = k or self.settings.max_retrieval_docs
        docs_with_scores = self.vector_store.similarity_search_with_score(query, k=k)
        
        # Debug output
        print(f"\n🔍 Query: '{query}'")
        for i, (doc, score) in enumerate(docs_with_scores, 1):
            print(f"  [{i}] Score: {score:.4f} | {doc.page_content[:100]}...")
        
        return [doc for doc, score in docs_with_scores]
    
    def get_document_info(self) -> dict:
        """Get information about uploaded documents."""
        sources = list(set(
            doc.metadata.get("source", "Unknown")
            for doc in self.uploaded_documents
        ))
        
        return {
            "total_chunks": len(self.uploaded_documents),
            "documents": sources
        }
    
    def clear_all_documents(self) -> None:
        """Clear all documents and vector store."""
        self.vector_store = None
        self.uploaded_documents = []