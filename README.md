# AgentSmith - AI Chatbot with RAG

A full-stack AI chatbot application with **Retrieval-Augmented Generation (RAG)** capabilities. Built with React (TypeScript) + Tailwind CSS frontend and FastAPI backend, powered by OpenAI's GPT-3.5-turbo and LangChain.

## 🌟 Features

- ✅ **Real-time chat** with OpenAI GPT-3.5-turbo
- ✅ **RAG (Retrieval-Augmented Generation)** - Upload PDFs and ask questions about them
- ✅ **Document processing** - Extract text, create embeddings, and store in vector database
- ✅ **FAISS vector store** - Efficient similarity search
- ✅ **Conversation history** - Maintains context from last 10 messages
- ✅ **Beautiful dark-themed UI** with Tailwind CSS
- ✅ **Message timestamps** and source citations
- ✅ **Loading indicators** and progress tracking
- ✅ **Error handling** with user-friendly messages
- ✅ **Responsive design** - Works on desktop and mobile
- ✅ **TypeScript** for type safety
- ✅ **Modular architecture** - Clean separation of concerns

## 🏗️ Project Structure

```
agentsmith/
├── frontend/                    # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Header.tsx
│   │   │   ├── RAGControls.tsx
│   │   │   ├── ChatMessages.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── LoadingIndicator.tsx
│   │   │   ├── ErrorDisplay.tsx
│   │   │   └── WelcomeScreen.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useChat.ts
│   │   │   └── useDocuments.ts
│   │   ├── services/          # API service layer
│   │   │   └── api.ts
│   │   ├── types/             # TypeScript types
│   │   │   └── chat.ts
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Tailwind CSS
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── backend/                    # FastAPI + Python + OpenAI
    ├── models/                # Pydantic models
    │   ├── __init__.py
    │   └── schemas.py
    ├── services/              # Business logic
    │   ├── __init__.py
    │   ├── document_service.py
    │   └── chat_service.py
    ├── routes/                # API endpoints
    │   ├── __init__.py
    │   ├── chat_routes.py
    │   ├── document_routes.py
    │   └── health_routes.py
    ├── main.py                # Application entry point
    ├── config.py              # Configuration management
    ├── requirements.txt       # Python dependencies
    └── .env.example          # Environment variables template
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **Custom Hooks** - State management and API integration

### Backend
- **FastAPI** - Modern Python web framework
- **OpenAI API** - GPT-3.5-turbo for chat responses
- **LangChain** - Framework for LLM applications
- **LangChain-OpenAI** - OpenAI integration for LangChain
- **FAISS** - Vector similarity search
- **PyPDF2** - PDF text extraction
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
- **npm** or **yarn**

## 🚀 Setup Instructions

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   ```bash
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate     # On Windows
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create a `.env` file from the example:**
   ```bash
   cp .env.example .env
   ```

6. **Edit `.env` and add your OpenAI API key:**
   ```env
   OPENAI_API_KEY=your_actual_api_key_here
   OPENAI_API_BASE=https://api.openai.com/v1
   ```

7. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

### Chat Endpoints

#### `POST /chat`
Send a message to the chatbot.

**Request Body:**
```json
{
  "message": "What is the main topic of the document?",
  "conversation_history": [
    {
      "role": "user",
      "content": "Previous message",
      "timestamp": "2025-10-03T10:00:00.000Z"
    }
  ],
  "use_rag": true
}
```

**Response:**
```json
{
  "message": "Based on the document, the main topic is...",
  "timestamp": "2025-10-03T10:00:01.000Z",
  "sources": ["document.pdf"]
}
```

### Document Endpoints

#### `POST /documents/upload`
Upload and process a PDF file.

**Request:** `multipart/form-data` with PDF file

**Response:**
```json
{
  "filename": "document.pdf",
  "pages": 10,
  "chunks": 25,
  "message": "Successfully processed document.pdf"
}
```

#### `GET /documents`
Get information about uploaded documents.

**Response:**
```json
{
  "total_chunks": 25,
  "documents": ["document.pdf"]
}
```

#### `DELETE /documents`
Clear all uploaded documents.

**Response:**
```json
{
  "message": "All documents cleared"
}
```

### Health Endpoints

#### `GET /`
Returns API status.

**Response:**
```json
{
  "message": "AgentSmith Chatbot API",
  "status": "online"
}
```

#### `GET /health`
Check API health and configuration.

**Response:**
```json
{
  "status": "healthy",
  "openai_configured": true,
  "api_base": "https://api.openai.com/v1",
  "documents_loaded": 25
}
```

## 💡 Usage

### Basic Chat

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Type a message in the input field
4. Press "Send" or hit Enter
5. The chatbot will respond using OpenAI's GPT-3.5-turbo

### RAG-Enhanced Chat

1. Click "📄 Upload PDF" button
2. Select a PDF file from your computer
3. Wait for processing (you'll see progress indicators)
4. Once uploaded, RAG mode is automatically enabled
5. Ask questions about the document
6. The chatbot will answer based on the document content
7. Responses will include source citations

### Managing Documents

- **View loaded documents**: Check the "Uploaded Documents" section
- **Toggle RAG**: Use the checkbox to enable/disable RAG mode
- **Clear documents**: Click "🗑️ Clear Docs" to remove all uploaded files
- **Clear chat**: Click "Clear Chat" to start a fresh conversation

## 🎨 Key Components

### Frontend Components

- **`Header`** - App title and clear chat button
- **`RAGControls`** - PDF upload, RAG toggle, and document management
- **`ChatMessages`** - Message list with auto-scroll
- **`ChatMessage`** - Individual message bubble with timestamp and sources
- **`ChatInput`** - Message input form
- **`LoadingIndicator`** - Animated loading dots
- **`ErrorDisplay`** - Error message display
- **`WelcomeScreen`** - Initial welcome screen

### Frontend Hooks

- **`useChat`** - Chat state management and message sending
- **`useDocuments`** - Document upload and management

### Backend Services

- **`DocumentService`** - PDF processing, embedding creation, vector store management
- **`ChatService`** - Chat message processing, RAG integration

### Backend Routes

- **`chat_routes`** - Chat endpoint
- **`document_routes`** - Document upload and management endpoints
- **`health_routes`** - Health check and root endpoints

## ⚙️ Configuration

### Backend Configuration (`config.py`)

```python
# App settings
app_name: str = "AgentSmith Chatbot API"
cors_origins: list = ["http://localhost:5173"]

# RAG settings
chunk_size: int = 1000          # Text chunk size
chunk_overlap: int = 200        # Overlap between chunks
batch_size: int = 100           # Batch size for embeddings
max_retrieval_docs: int = 3     # Number of docs to retrieve

# Model settings
model_name: str = "gpt-3.5-turbo"
max_tokens: int = 500
temperature: float = 0.7
```

All settings can be overridden via environment variables.

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload  # Start with auto-reload
```

### API Documentation

FastAPI automatically generates interactive API documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🐛 Troubleshooting

### Backend Issues

- **401 Error**: Check your OpenAI API key in the `.env` file
- **429 Error**: Rate limit exceeded, wait a moment and try again
- **500 Error with token limit**: PDF too large, try a smaller document or the system will batch process it
- **Import errors**: Make sure all dependencies are installed with `pip install -r requirements.txt`

### Frontend Issues

- **CORS Error**: Ensure backend is running on port 8000 and frontend on 5173
- **Connection Error**: Make sure both servers are running
- **Upload stuck**: Check backend terminal for error messages

### PDF Processing Issues

- **"No text content found"**: PDF might be image-based (scanned), needs OCR
- **"PyCryptodome required"**: Install with `pip install pycryptodome`
- **"Token limit exceeded"**: The system automatically batches large documents

## 📦 Dependencies

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.2.2",
  "tailwindcss": "^3.3.5",
  "vite": "^5.0.0"
}
```

### Backend
```txt
fastapi>=0.104.1
uvicorn[standard]>=0.24.0
pydantic>=2.5.0
pydantic-settings>=2.0.0
openai>=1.51.0
python-dotenv>=1.0.0
pypdf2>=3.0.1
langchain>=0.1.20
langchain-openai>=0.1.0
langchain-community>=0.0.38
faiss-cpu>=1.7.4
tiktoken>=0.5.2
python-multipart>=0.0.6
pycryptodome>=3.19.0
```

## 🌐 Environment Variables

### Backend (`.env`)
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1

# For Ollama (local LLM), uncomment and use:
# OPENAI_API_BASE=http://localhost:11434/v1
# OPENAI_API_KEY=ollama
```

## 🏗️ Architecture

### Frontend Architecture
- **Component-based** - Reusable UI components
- **Custom Hooks** - Encapsulated business logic
- **Service Layer** - Centralized API communication
- **Type Safety** - Full TypeScript coverage

### Backend Architecture
- **Service Layer** - Business logic separation
- **Route Handlers** - RESTful API endpoints
- **Dependency Injection** - Services injected into routes
- **Pydantic Models** - Request/response validation
- **Configuration Management** - Centralized settings

### RAG Pipeline
1. **Document Upload** - User uploads PDF
2. **Text Extraction** - PyPDF2 extracts text from PDF
3. **Text Chunking** - Text split into manageable chunks
4. **Embedding Creation** - OpenAI creates embeddings in batches
5. **Vector Storage** - FAISS stores embeddings
6. **Query Processing** - User question is embedded
7. **Similarity Search** - FAISS finds relevant chunks
8. **Context Building** - Relevant chunks added to prompt
9. **Response Generation** - GPT generates answer with context
10. **Source Citation** - Response includes source documents

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions, please open an issue on the repository.