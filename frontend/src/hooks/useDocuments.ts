import { useState, useEffect } from 'react';
import { DocumentInfo } from '../types/chat';
import { chatApi } from '../services/api';

export const useDocuments = () => {
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const data = await chatApi.getDocuments();
      setDocumentInfo(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const uploadPDF = async (file: File) => {
    setIsUploading(true);
    try {
      const data = await chatApi.uploadPDF(file);
      await fetchDocuments();
      return data;
    } finally {
      setIsUploading(false);
    }
  };

  const clearDocuments = async () => {
    await chatApi.clearDocuments();
    setDocumentInfo(null);
  };

  return {
    documentInfo,
    isUploading,
    uploadPDF,
    clearDocuments,
  };
};