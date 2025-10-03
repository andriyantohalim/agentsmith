import { useState } from 'react';
import { Header } from './components/Header';
import { RAGControls } from './components/RAGControls';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { useChat } from './hooks/useChat';
import { useDocuments } from './hooks/useDocuments';

function App() {
  const [useRAG, setUseRAG] = useState(false);
  const { messages, isLoading, error, sendMessage, clearChat, addSystemMessage } = useChat();
  const {
    documentInfo,
    isUploading,
    uploadProgress,
    uploadPDF,
    clearDocuments,
  } = useDocuments();

  const handleFileUpload = async (file: File) => {
    try {
      const data = await uploadPDF(file);
      
      addSystemMessage(
        `📄 Successfully uploaded "${data.filename}"\n\n📊 Processed ${data.pages} pages into ${data.chunks} chunks.\n\n💡 You can now ask questions about this document. RAG mode has been enabled.`
      );
      
      setUseRAG(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload PDF';
      addSystemMessage(`❌ Upload failed: ${errorMessage}`);
    }
  };

  const handleClearDocuments = async () => {
    await clearDocuments();
    setUseRAG(false);
    addSystemMessage('🗑️ All documents have been cleared.');
  };

  const handleSendMessage = async (message: string) => {
    await sendMessage(message, useRAG);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header onClearChat={clearChat} />
      
      <RAGControls
        useRAG={useRAG}
        onToggleRAG={setUseRAG}
        onFileUpload={handleFileUpload}
        onClearDocuments={handleClearDocuments}
        documentInfo={documentInfo}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
      />

      <ChatMessages messages={messages} isLoading={isLoading} error={error} />

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        useRAG={useRAG}
      />
    </div>
  );
}

export default App;