# AgentSmith Chatbot

A full-stack AI chatbot application built with React (TypeScript) + Tailwind CSS frontend and FastAPI backend, powered by OpenAI's GPT-3.5-turbo.

## Project Structure

```
agentsmith/
├── frontend/          # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── types/
│   │   │   └── chat.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── backend/           # FastAPI + Python + OpenAI
    ├── main.py
    ├── requirements.txt
    └── .env.example
```

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server

### Backend
- **FastAPI** - Modern Python web framework
- **OpenAI API** - GPT-3.5-turbo for chat responses
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

## Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
- **npm** or **yarn**

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate     # On Windows
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

6. Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

7. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## API Endpoints

### GET `/`
Returns API status.

**Response:**
```json
{
  "message": "AgentSmith Chatbot API",
  "status": "online"
}
```

### POST `/chat`
Send a message to the chatbot.

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "conversation_history": [
    {
      "role": "user",
      "content": "Previous message",
      "timestamp": "2025-10-03T10:00:00.000Z"
    }
  ]
}
```

**Response:**
```json
{
  "message": "I'm doing great, thank you for asking! How can I help you today?",
  "timestamp": "2025-10-03T10:00:01.000Z"
}
```

### GET `/health`
Check API health and configuration.

**Response:**
```json
{
  "status": "healthy",
  "openai_configured": true
}
```

## Features

- ✅ Real-time chat with OpenAI GPT-3.5-turbo
- ✅ Conversation history context (last 10 messages)
- ✅ Beautiful dark-themed UI with Tailwind CSS
- ✅ Message timestamps
- ✅ Loading indicators
- ✅ Error handling
- ✅ Clear chat functionality
- ✅ Responsive design
- ✅ TypeScript for type safety
- ✅ CORS configured for local development

## Development

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
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Type a message in the input field
4. Press "Send" or hit Enter
5. The chatbot will respond using OpenAI's GPT-3.5-turbo
6. Continue the conversation - the bot maintains context from previous messages
7. Click "Clear Chat" to start a new conversation

## Troubleshooting

- **401 Error**: Check your OpenAI API key in the `.env` file
- **429 Error**: You've hit the rate limit, wait a moment and try again
- **CORS Error**: Ensure backend is running on port 8000 and frontend on 5173
- **Connection Error**: Make sure both servers are running

## License

MIT