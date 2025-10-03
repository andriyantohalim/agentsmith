import { useState, FormEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  useRAG: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading, useRAG }: ChatInputProps) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    onSendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className="border-t border-neutral-800 bg-neutral-850 shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  useRAG
                    ? 'Ask a question about your documents...'
                    : 'Type your message...'
                }
                disabled={isLoading}
                className="w-full bg-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-xl px-5 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-neutral-700 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              />
              {inputMessage && !isLoading && (
                <button
                  type="button"
                  onClick={() => setInputMessage('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:text-neutral-600 disabled:border disabled:border-neutral-700 flex items-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <span>Send</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};