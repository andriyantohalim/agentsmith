interface HeaderProps {
  onClearChat: () => void;
}

export const Header = ({ onClearChat }: HeaderProps) => {
  return (
    <header className="bg-neutral-850 border-b border-neutral-800 shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-xl tracking-tight">AS</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-50 tracking-tight">
                AgentSmith
              </h1>
              <p className="text-xs text-neutral-400 font-medium">
                AI Assistant with RAG
              </p>
            </div>
          </div>
          <button
            onClick={onClearChat}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg transition-all duration-200 border border-neutral-700 hover:border-neutral-600"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </header>
  );
};