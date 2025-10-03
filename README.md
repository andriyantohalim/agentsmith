# AgentSmith

A simple full-stack web application built with React (TypeScript) + Tailwind CSS frontend and FastAPI backend.

## Project Structure

```
agentsmith/
├── frontend/          # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── backend/           # FastAPI + Python
    ├── main.py
    └── requirements.txt
```

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

## Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
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

5. Run the FastAPI server:
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
Returns a welcome message from the API.

**Response:**
```json
{
  "message": "Hello from FastAPI!"
}
```

### GET `/items`
Returns a list of items.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Item 1",
    "description": "First item"
  },
  {
    "id": 2,
    "name": "Item 2",
    "description": "Second item"
  },
  {
    "id": 3,
    "name": "Item 3",
    "description": "Third item"
  }
]
```

### POST `/items`
Creates a new item.

**Request Body:**
```json
{
  "name": "New Item",
  "description": "Item description"
}
```

**Response:**
```json
{
  "id": 4,
  "name": "New Item",
  "description": "Item description"
}
```

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

## Features

- ✅ React with TypeScript for type safety
- ✅ Tailwind CSS for responsive styling
- ✅ FastAPI with async/await support
- ✅ CORS configured for local development
- ✅ Pydantic models for data validation
- ✅ Hot reload for both frontend and backend

## License

MIT