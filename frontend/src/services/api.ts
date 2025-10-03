import { ChatRequest, ChatResponse, UploadResponse, DocumentInfo } from '../types/chat';

const API_BASE_URL = 'http://localhost:8000';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Request failed');
  }
  
  return response.json();
}

export const chatApi = {
  sendMessage: (request: ChatRequest) =>
    fetchApi<ChatResponse>('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    }),

  uploadPDF: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchApi<UploadResponse>('/documents/upload', {
      method: 'POST',
      body: formData,
    });
  },

  getDocuments: () => fetchApi<DocumentInfo>('/documents'),
  
  clearDocuments: () => fetchApi<void>('/documents', { method: 'DELETE' }),
  
  healthCheck: () => fetchApi('/health'),
};