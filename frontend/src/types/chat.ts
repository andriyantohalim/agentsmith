export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
}

export interface ChatResponse {
  message: string;
  timestamp: string;
  sources?: string[];
}

export interface UploadResponse {
  filename: string;
  pages: number;
  chunks: number;
  message: string;
}

export interface DocumentInfo {
  total_chunks: number;
  documents: string[];
}