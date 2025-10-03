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
  const { documentInfo, isUploading, uploadPDF, clearDocuments } = useDocuments();

  const handleFileUpload = async (file: File) => {
    try {
      const data = await uploadPDF(file);
      addSystemMessage(
        `Successfully uploaded "${data.filename}"\n\nProcessed ${data.pages} pages into ${data.chunks} chunks. RAG mode is now active.`
      );
      setUseRAG(true);
    } catch (err) {
      addSystemMessage(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleClearDocuments = async () => {
    await clearDocuments();
    setUseRAG(false);
    addSystemMessage('All documents have been cleared from the system.');
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900">
      <Header onClearChat={clearChat} />
      
      <RAGControls
        useRAG={useRAG}
        onToggleRAG={setUseRAG}
        onFileUpload={handleFileUpload}
        onClearDocuments={handleClearDocuments}
        documentInfo={documentInfo}
        isUploading={isUploading}
      />

      <ChatMessages messages={messages} isLoading={isLoading} error={error} />

      <ChatInput
        onSendMessage={(msg) => sendMessage(msg, useRAG)}
        isLoading={isLoading}
        useRAG={useRAG}
      />
    </div>
  );
}

export default App;