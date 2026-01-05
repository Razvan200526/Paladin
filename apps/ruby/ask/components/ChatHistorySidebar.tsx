import { Button } from '@common/components/button';
import { ChatHistorySkeleton } from '@common/components/skeletons/ChatHistorySkeleton';
import { H6 } from '@common/components/typography';
import { formatDate } from '@common/utils';
import { cn, ScrollShadow } from '@heroui/react';
import { MessageSquareIcon, Trash2Icon } from 'lucide-react';
import { useMemo } from 'react';
import type { ChatHistoryItem } from '../useAiChatHistory';

// Group history by date
const groupHistoryByDate = (history: ChatHistoryItem[]) => {
  const groups: { [key: string]: ChatHistoryItem[] } = {};

  history.forEach((item) => {
    const dateLabel = formatDate(item.createdAt);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(item);
  });

  return groups;
};
export const ChatHistorySidebar = ({
  history,
  isLoading,
  onNewChat,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
}: {
  history: ChatHistoryItem[];
  isLoading: boolean;
  onNewChat: () => void;
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}) => {
  const groupedHistory = useMemo(() => groupHistoryByDate(history), [history]);

  return (
    <div className="w-64 rounded border border-border bg-background flex flex-col h-full">
      <ScrollShadow className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <ChatHistorySkeleton />
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-secondary-text/60 text-sm">
            No chat history yet
          </div>
        ) : (
          <div className="space-y-4">
            <H6 className="px-4 pt-4">History</H6>
            {Object.entries(groupedHistory).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <div className="space-y-1">
                  {items.map((item) => (
                    // biome-ignore lint/a11y/useSemanticElements: <trust me>
<div
                      key={item.id}
                      onClick={() => onSelectSession(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onSelectSession(item.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg transition-colors group cursor-pointer',
                        item.id === currentSessionId
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-secondary/10',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquareIcon
                          className={cn(
                            'size-3.5 shrink-0',
                            item.id === currentSessionId
                              ? 'text-primary'
                              : 'text-secondary-text group-hover:text-primary',
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm truncate flex-1',
                            item.id === currentSessionId
                              ? 'text-primary font-medium'
                              : 'text-secondary-text group-hover:text-primary',
                          )}
                        >
                          {item.title}
                        </span>
                        <Button
                          variant="light"
                          color="secondary"
                          radius="full"
                          isIconOnly
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onDeleteSession(item.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.stopPropagation();
                              e.preventDefault();
                              onDeleteSession(item.id);
                            }
                          }}
                          endContent={<Trash2Icon className="size-3.5" />}
                          className="opacity-0 group-hover:opacity-100 text-secondary-text hover:text-danger transition-opacity cursor-pointer p-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollShadow>
    </div>
  );
};
