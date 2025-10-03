import { useState, useEffect } from 'react';
import { DocumentInfo } from '../types/chat';
import { chatApi } from '../services/api';

export const useDocuments = () => {
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const fetchDocuments = async () => {
    try {
      const data = await chatApi.getDocuments();
      setDocumentInfo(data);
    } catch (err) {
      console.error('Error fetching document info:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const uploadPDF = async (file: File) => {
    setIsUploading(true);
    setUploadProgress('📤 Uploading file...');

    try {
      setUploadProgress('📄 Extracting text from PDF...');
      const data = await chatApi.uploadPDF(file);
      
      setUploadProgress('🧠 Creating embeddings...');
      await fetchDocuments();
      
      setUploadProgress('✅ Upload complete!');
      
      setTimeout(() => {
        setUploadProgress('');
      }, 2000);

      return data;
    } catch (err) {
      setUploadProgress('');
      throw err;
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
    uploadProgress,
    uploadPDF,
    clearDocuments,
    refreshDocuments: fetchDocuments,
  };
};