from typing import List, Optional
from langchain.schema import Document
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from config import get_settings

class DocumentService:
    def __init__(self):
        self.settings = get_settings()
        self.vector_store: Optional[FAISS] = None
        self.uploaded_documents: List[Document] = []
        self.embeddings = OpenAIEmbeddings(
            api_key=self.settings.openai_api_key
        )
    
    def extract_text_from_pdf(self, file_path: str) -> tuple[str, int]:
        """Extract text from PDF file and return text and page count."""
        pdf_reader = PdfReader(file_path)
        text = ""
        
        for i, page in enumerate(pdf_reader.pages):
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
            print(f"Processed page {i+1}/{len(pdf_reader.pages)}")
        
        return text, len(pdf_reader.pages)
    
    def split_text_into_chunks(self, text: str) -> List[str]:
        """Split text into chunks for embedding."""
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.settings.chunk_size,
            chunk_overlap=self.settings.chunk_overlap,
            length_function=len
        )
        
        return text_splitter.split_text(text)
    
    def create_documents(self, chunks: List[str], filename: str) -> List[Document]:
        """Create Document objects from text chunks."""
        return [
            Document(page_content=chunk, metadata={"source": filename})
            for chunk in chunks
        ]
    
    def add_documents_to_vector_store(self, documents: List[Document]) -> None:
        """Add documents to vector store in batches."""
        batch_size = self.settings.batch_size
        total_batches = (len(documents) + batch_size - 1) // batch_size
        
        if self.vector_store is None:
            print(f"Creating new vector store with {total_batches} batches...")
            # Create initial vector store with first batch
            first_batch = documents[:batch_size]
            self.vector_store = FAISS.from_documents(first_batch, self.embeddings)
            print(f"Batch 1/{total_batches} processed")
            
            # Add remaining batches
            for i in range(batch_size, len(documents), batch_size):
                batch = documents[i:i + batch_size]
                batch_num = (i // batch_size) + 1
                print(f"Processing batch {batch_num}/{total_batches}...")
                self.vector_store.add_documents(batch)
                print(f"Batch {batch_num}/{total_batches} processed")
        else:
            print(f"Adding to existing vector store with {total_batches} batches...")
            for i in range(0, len(documents), batch_size):
                batch = documents[i:i + batch_size]
                batch_num = (i // batch_size) + 1
                print(f"Processing batch {batch_num}/{total_batches}...")
                self.vector_store.add_documents(batch)
                print(f"Batch {batch_num}/{total_batches} processed")
    
    def process_pdf(self, file_path: str, filename: str) -> tuple[int, int]:
        """Process PDF file and add to vector store."""
        # Extract text
        print("Extracting text from PDF...")
        text, page_count = self.extract_text_from_pdf(file_path)
        
        if not text.strip():
            raise ValueError("No text content found in PDF")
        
        print(f"Extracted {len(text)} characters of text")
        
        # Split into chunks
        print("Splitting text into chunks...")
        chunks = self.split_text_into_chunks(text)
        print(f"Created {len(chunks)} chunks")
        
        # Create documents
        documents = self.create_documents(chunks, filename)
        self.uploaded_documents.extend(documents)
        
        # Add to vector store
        print("Creating embeddings in batches...")
        self.add_documents_to_vector_store(documents)
        print("Vector store updated successfully")
        
        return page_count, len(chunks)
    
    def retrieve_relevant_documents(self, query: str) -> List[Document]:
        """Retrieve relevant documents for a query."""
        if self.vector_store is None:
            return []
        
        retriever = self.vector_store.as_retriever(
            search_kwargs={"k": self.settings.max_retrieval_docs}
        )
        return retriever.get_relevant_documents(query)
    
    def get_document_info(self) -> dict:
        """Get information about uploaded documents."""
        sources = list(set([
            doc.metadata.get("source", "Unknown")
            for doc in self.uploaded_documents
        ]))
        
        return {
            "total_chunks": len(self.uploaded_documents),
            "documents": sources
        }
    
    def clear_all_documents(self) -> None:
        """Clear all documents and vector store."""
        self.vector_store = None
        self.uploaded_documents = []