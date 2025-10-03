import { useRef } from 'react';
import { DocumentInfo } from '../types/chat';

interface RAGControlsProps {
  useRAG: boolean;
  onToggleRAG: (enabled: boolean) => void;
  onFileUpload: (file: File) => void;
  onClearDocuments: () => void;
  documentInfo: DocumentInfo | null;
  isUploading: boolean;
  uploadProgress: string;
}

export const RAGControls = ({
  useRAG,
  onToggleRAG,
  onFileUpload,
  onClearDocuments,
  documentInfo,
  isUploading,
  uploadProgress,
}: RAGControlsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-3">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? '⏳ Processing...' : '📄 Upload PDF'}
            </label>

            {documentInfo && documentInfo.documents.length > 0 && (
              <>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rag-toggle"
                    checked={useRAG}
                    onChange={(e) => onToggleRAG(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="rag-toggle" className="text-sm text-gray-300">
                    {useRAG ? '✅ RAG Enabled' : '⬜ RAG Disabled'}
                  </label>
                </div>

                <button
                  onClick={onClearDocuments}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                >
                  🗑️ Clear Docs
                </button>
              </>
            )}
          </div>

          {documentInfo && documentInfo.documents.length > 0 && (
            <div className="text-sm text-gray-400">
              📚 {documentInfo.total_chunks} chunks loaded
            </div>
          )}
        </div>

        {/* Upload Progress Indicator */}
        {uploadProgress && (
          <div className="mb-3 bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
              <span className="text-blue-300 text-sm font-medium">{uploadProgress}</span>
            </div>
          </div>
        )}

        {/* Uploaded Documents List */}
        {documentInfo && documentInfo.documents.length > 0 && (
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-2">Uploaded Documents:</p>
            <div className="flex flex-wrap gap-2">
              {documentInfo.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded text-sm text-blue-300 flex items-center space-x-2"
                >
                  <span>📄</span>
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};