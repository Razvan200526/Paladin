import { Button } from '@common/components/button';
import { AiChatIcon } from '@common/icons/AiChatIcon';
import { useAuth } from '@ruby/shared/hooks';
import { Trash2Icon, WifiOffIcon } from 'lucide-react';
import { useAiChat } from '../useAiChat';
import { useAiChatHistory } from '../useAiChatHistory';

export const Header = () => {
  const { data: user } = useAuth();

  const { refetch: refetchHistory } = useAiChatHistory({
    userId: user?.id,
    enabled: !!user?.id,
  });
  const { sessionTitle, isConnected, clearChat, messages } = useAiChat({
    userId: user?.id,
    enabled: !!user?.id,
    onError: (error) => {
      console.error('[AI Chat Error]:', error);
    },
    onSessionChange: () => {
      refetchHistory();
    },
  });
  return (
    <div className="border-b border-border bg-background px-6 py-3 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <AiChatIcon className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-primary leading-tight">
              {sessionTitle || 'Ask AI'}
            </h2>
            <span className="text-xs text-secondary-text">
              Career Assistant
            </span>
          </div>
          {!isConnected && <WifiOffIcon className="size-4 text-danger ml-2" />}
        </div>
        {messages.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onPress={clearChat}
            className="text-secondary-text hover:text-danger"
          >
            <Trash2Icon className="size-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};
