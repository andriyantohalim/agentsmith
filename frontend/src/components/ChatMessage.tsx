import { Message } from '../types/chat';

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 ${
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        
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
        
        <p className={`text-xs mt-2 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};