interface HeaderProps {
  onClearChat: () => void;
}

export const Header = ({ onClearChat }: HeaderProps) => {
  return (
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
            onClick={onClearChat}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </header>
  );
};