import {
  InputChat,
  type InputChatRefType,
} from '@common/components/input/InputChat';
import { suggestions } from '../utils';
import { SuggestionButton } from './SuggetionButton';
import { useRef } from 'react';
import { useAiChat } from '../useAiChat';
import { useAuth } from '@ruby/shared/hooks';
import { useAiChatHistory } from '../useAiChatHistory';
import { H4 } from '@common/components/typography';

export const EmptyState = () => {
  const { data: user } = useAuth();
  const { refetch: refetchHistory } = useAiChatHistory({
    userId: user?.id,
    enabled: !!user?.id,
  });
  const { sendMessage, isStreaming } = useAiChat({
    userId: user?.id,
    enabled: !!user?.id,
    onError: (error) => {
      console.error('[AI Chat Error]:', error);
    },
    onSessionChange: () => {
      refetchHistory();
    },
  });
  const messageRef = useRef<InputChatRefType | null>(null);
  const handleSend = (message: string) => {
    if (!message.trim() || isStreaming) return;
    console.log(message);
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
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xl space-y-8">
          {/* Welcome */}
          <div className="text-center space-y-3">
            <H4 className="tracking-tight">What would you like to know?</H4>
            <p className="text-sm font-semibold text-secondary-text max-w-md mx-auto">
              Get personalized advice on resumes, cover letters, and your job
              search journey
            </p>
          </div>

          {/* Input */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
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
        className='p-8'
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
