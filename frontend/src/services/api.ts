import { ChatRequest, ChatResponse, UploadResponse, DocumentInfo } from '../types/chat';

const API_BASE_URL = 'http://localhost:8000';

export const chatApi = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get response');
    }

    return response.json();
  },

  async uploadPDF(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to upload PDF');
    }

    return response.json();
  },

  async getDocuments(): Promise<DocumentInfo> {
    const response = await fetch(`${API_BASE_URL}/documents`);
    return response.json();
  },

  async clearDocuments(): Promise<void> {
    await fetch(`${API_BASE_URL}/documents`, { method: 'DELETE' });
  },

  async healthCheck(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};