import { useEffect, useRef } from 'react';
import { Message } from '../types/chat';
import { ChatMessage } from './ChatMessage';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorDisplay } from './ErrorDisplay';
import { WelcomeScreen } from './WelcomeScreen';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export const ChatMessages = ({ messages, isLoading, error }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="container mx-auto max-w-4xl">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        )}

        {isLoading && <LoadingIndicator />}
        {error && <ErrorDisplay error={error} />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};