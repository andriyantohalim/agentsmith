export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}