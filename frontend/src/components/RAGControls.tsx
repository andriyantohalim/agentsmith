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
    <div className="bg-neutral-850 border-b border-neutral-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
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
              className={`inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {isUploading ? 'Uploading...' : 'Upload PDF'}
            </label>

            {hasDocuments && (
              <>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 border border-neutral-700">
                  <input
                    type="checkbox"
                    checked={useRAG}
                    onChange={(e) => onToggleRAG(e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-neutral-700 border-neutral-600 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                  />
                  <span className="text-sm font-medium">
                    {useRAG ? 'RAG Active' : 'RAG Inactive'}
                  </span>
                </label>

                <button
                  onClick={onClearDocuments}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-red-900/20 text-neutral-300 hover:text-red-400 text-sm font-medium rounded-lg transition-all duration-200 border border-neutral-700 hover:border-red-800"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Docs
                </button>
              </>
            )}
          </div>

          {hasDocuments && (
            <div className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {documentInfo.total_chunks} chunks loaded
            </div>
          )}
        </div>

        {hasDocuments && (
          <div className="mt-4 bg-neutral-800/50 rounded-lg p-4 border border-neutral-800">
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide mb-3">
              Uploaded Documents
            </p>
            <div className="flex flex-wrap gap-2">
              {documentInfo.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 bg-primary-900/20 border border-primary-800/30 px-3 py-1.5 rounded-lg text-sm text-primary-300 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {doc}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};