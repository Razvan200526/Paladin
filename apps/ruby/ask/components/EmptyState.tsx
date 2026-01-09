import {
  InputChat,
  type InputChatRefType,
} from '@common/components/input/InputChat';
import { H4 } from '@common/components/typography';
import { useRef } from 'react';
import { suggestions } from '../utils';
import { SuggestionButton } from './SuggetionButton';

interface EmptyStateProps {
  sendMessage: (message: string) => void;
  isStreaming: boolean;
}

export const EmptyState = ({ sendMessage, isStreaming }: EmptyStateProps) => {
  const messageRef = useRef<InputChatRefType | null>(null);
  const handleSend = (message: string) => {
    if (!message.trim() || isStreaming) return;
    try {
      sendMessage(message);
    } catch (e) {
      console.error(e);
    }
    messageRef.current?.clear();
  };
  function handleStop(): void {
    console.debug('Stopping');
  }

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-6">
        <div className="w-full max-w-xl space-y-4 sm:space-y-8">
          {/* Welcome */}
          <div className="text-center space-y-2 sm:space-y-3">
            <H4 className="tracking-tight text-base sm:text-lg md:text-xl">
              What would you like to know?
            </H4>
            <p className="text-xs sm:text-sm text-secondary-text max-w-md mx-auto">
              Get personalized advice on resumes, cover letters, and your job
              search journey
            </p>
          </div>

          {/* Suggestions */}
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {suggestions.map((suggestion) => (
                <SuggestionButton
                  key={suggestion.title}
                  icon={suggestion.icon}
                  title={suggestion.title}
                  prompt={suggestion.prompt}
                  onClick={() => handleSend(suggestion.prompt)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <InputChat
        className="p-3 sm:p-6 md:p-8"
        ref={messageRef}
        placeholder="Ask me anything..."
        onSubmit={handleSend}
        onStop={handleStop}
        isPending={isStreaming}
        showStopButton={false}
      />
    </>
  );
};
