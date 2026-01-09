import { Button } from '@common/components/button';
import { H6 } from '@common/components/typography';
import { AiChatIcon } from '@common/icons/AiChatIcon';
import { ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@ruby/shared/hooks';
import { Trash2Icon, WifiOffIcon } from 'lucide-react';
import { useAiChat } from '../useAiChat';
import { useAiChatHistory } from '../useAiChatHistory';

interface HeaderProps {
  onHistoryToggle?: () => void;
  showHistoryButton?: boolean;
}

export const Header = ({
  onHistoryToggle,
  showHistoryButton = false,
}: HeaderProps) => {
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
    <div className="border-b border-border bg-background px-3 sm:px-6 py-2 sm:py-3 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <div className="flex items-center justify-center shrink-0">
            <AiChatIcon className="size-4 sm:size-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <H6 className="text-primary text-sm sm:text-base truncate">
              {sessionTitle || 'Ask AI'}
            </H6>
            <span className="text-xs text-secondary-text hidden sm:block">
              Career Assistant
            </span>
          </div>
          {!isConnected && (
            <WifiOffIcon className="size-4 text-danger ml-1 sm:ml-2 shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {messages.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onPress={clearChat}
              className="text-secondary-text hover:text-danger"
            >
              <Trash2Icon className="size-4" />
              <span className="hidden sm:inline ml-1">Clear</span>
            </Button>
          )}

          {/* Mobile History Toggle Button */}
          {showHistoryButton && (
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onPress={onHistoryToggle}
              className="lg:hidden"
            >
              <ClockIcon className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
