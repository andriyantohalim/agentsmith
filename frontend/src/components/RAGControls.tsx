import { useRef } from 'react';
import { DocumentInfo } from '../types/chat';

interface RAGControlsProps {
  useRAG: boolean;
  onToggleRAG: (enabled: boolean) => void;
  onFileUpload: (file: File) => void;
  onClearDocuments: () => void;
  documentInfo: DocumentInfo | null;
  isUploading: boolean;
}

export const RAGControls = ({
  useRAG,
  onToggleRAG,
  onFileUpload,
  onClearDocuments,
  documentInfo,
  isUploading,
}: RAGControlsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const hasDocuments = documentInfo && documentInfo.documents.length > 0;

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
              {isUploading ? '⏳ Uploading...' : '📄 Upload PDF'}
            </label>

            {hasDocuments && (
              <>
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={useRAG}
                    onChange={(e) => onToggleRAG(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                  />
                  <span>{useRAG ? '✅ RAG Enabled' : '⬜ RAG Disabled'}</span>
                </label>

                <button
                  onClick={onClearDocuments}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                >
                  🗑️ Clear Docs
                </button>
              </>
            )}
          </div>

          {hasDocuments && (
            <div className="text-sm text-gray-400">
              📚 {documentInfo.total_chunks} chunks
            </div>
          )}
        </div>

        {hasDocuments && (
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-2">Uploaded:</p>
            <div className="flex flex-wrap gap-2">
              {documentInfo.documents.map((doc, idx) => (
                <span
                  key={idx}
                  className="bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded text-sm text-blue-300"
                >
                  📄 {doc}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};