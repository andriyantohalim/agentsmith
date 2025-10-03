# AgentSmith - AI Chatbot with RAG

A modern AI chatbot with **Retrieval-Augmented Generation (RAG)** - upload PDFs and chat about their content using OpenAI GPT-3.5-turbo.

Built with **React + TypeScript** (frontend) and **FastAPI + Python** (backend).

## ✨ Features

- 💬 Real-time chat with GPT-3.5-turbo
- 📄 Upload PDFs and ask questions about them (RAG)
- 🎨 Dark-themed, responsive UI
- 📚 Source citations in responses
- ⚡ Fast vector similarity search (FAISS)
- 🔒 Type-safe with TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.9+
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📖 Usage

1. **Basic Chat**: Type a message and press Send
2. **RAG Chat**: 
   - Click "Upload PDF"
   - Select a PDF file
   - Ask questions about the document
   - Responses include source citations

## 🏗️ Project Structure

```
agentsmith/
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API layer
│   │   └── types/         # TypeScript types
│   └── ...
└── backend/               # FastAPI + Python
    ├── models/            # Pydantic schemas
    ├── services/          # Business logic
    ├── routes/            # API endpoints
    ├── config.py          # Settings
    └── main.py            # Entry point
```

## 🔧 Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Vite  
**Backend:** FastAPI, OpenAI API, LangChain, FAISS, PyPDF2  
**Database:** FAISS vector store (in-memory)

## 🌐 API Endpoints

- `POST /chat` - Send a message
- `POST /documents/upload` - Upload PDF
- `GET /documents` - Get uploaded documents
- `DELETE /documents` - Clear all documents
- `GET /health` - Health check

Full API docs: `http://localhost:8000/docs`

## ⚙️ Configuration

Edit `backend/config.py` or use environment variables:

```python
CHUNK_SIZE = 1000          # Text chunk size
BATCH_SIZE = 100           # Embedding batch size
MAX_RETRIEVAL_DOCS = 3     # Docs to retrieve for RAG
MODEL_NAME = "gpt-3.5-turbo"
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Error | Check your OpenAI API key in `.env` |
| Upload fails | Check PDF is text-based (not scanned images) |
| CORS Error | Ensure backend runs on :8000, frontend on :5173 |
| Token limit | System auto-batches large PDFs in 100-chunk batches |

## 📝 License

MIT

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first.