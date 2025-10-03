import { useState, useRef, useEffect } from 'react';
import { Message, ChatResponse, UploadResponse, DocumentInfo } from './types/chat';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useRAG, setUseRAG] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchDocumentInfo();
  }, []);

  const fetchDocumentInfo = async () => {
    try {
      const response = await fetch('http://localhost:8000/documents');
      const data = await response.json();
      setDocumentInfo(data);
      console.log('Document info:', data);
    } catch (err) {
      console.error('Error fetching document info:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Uploading file:', file.name);

    setIsUploading(true);
    setUploadProgress('📤 Uploading file...');
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress('📄 Extracting text from PDF...');
      
      const response = await fetch('http://localhost:8000/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload PDF');
      }

      setUploadProgress('🧠 Creating embeddings...');

      const data: UploadResponse = await response.json();
      console.log('Upload response:', data);
      
      setUploadProgress('✅ Upload complete!');
      
      // Add system message about uploaded document
      const systemMessage: Message = {
        role: 'assistant',
        content: `📄 Successfully uploaded "${data.filename}"\n\n📊 Processed ${data.pages} pages into ${data.chunks} chunks.\n\n💡 You can now ask questions about this document. RAG mode has been enabled.`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, systemMessage]);
      
      // Fetch updated document info
      await fetchDocumentInfo();
      
      // Auto-enable RAG mode after upload
      setUseRAG(true);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Clear progress after 2 seconds
      setTimeout(() => {
        setUploadProgress('');
      }, 2000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload PDF');
      setUploadProgress('');
    } finally {
      setIsUploading(false);
    }
  };

  const clearDocuments = async () => {
    try {
      await fetch('http://localhost:8000/documents', { method: 'DELETE' });
      setDocumentInfo(null);
      setUseRAG(false);
      
      const systemMessage: Message = {
        role: 'assistant',
        content: '🗑️ All documents have been cleared.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, systemMessage]);
    } catch (err) {
      setError('Failed to clear documents');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversation_history: messages,
          use_rag: useRAG
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response');
      }

      const data: ChatResponse = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: data.timestamp,
        sources: data.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AS</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AgentSmith</h1>
              <p className="text-sm text-gray-400">AI Assistant with RAG</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </header>

      {/* RAG Controls */}
      <div className="bg-gray-800 border-b border-gray-700 p-3">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
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
                      onChange={(e) => setUseRAG(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="rag-toggle" className="text-sm text-gray-300">
                      {useRAG ? '✅ RAG Enabled' : '⬜ RAG Disabled'}
                    </label>
                  </div>
                  
                  <button
                    onClick={clearDocuments}
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

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="container mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="text-center mt-20">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-3xl">AS</span>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Welcome to AgentSmith
              </h2>
              <p className="text-gray-400 mb-4">
                Upload a PDF and ask questions about it using RAG
              </p>
              <p className="text-sm text-gray-500">
                Or start a regular conversation
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <p className="text-xs text-gray-400 mb-1">📚 Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.sources.map((source, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-600/30 px-2 py-1 rounded border border-blue-500/30"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 rounded-2xl p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
              <p className="font-semibold">❌ Error:</p>
              <p>{error}</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-700 bg-gray-800 p-4">
        <form onSubmit={sendMessage} className="container mx-auto max-w-4xl">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={useRAG ? "Ask a question about your documents..." : "Type your message..."}
              disabled={isLoading}
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;