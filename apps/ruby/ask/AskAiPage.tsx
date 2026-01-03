import { EmptyChat } from '@common/components/empty/EmptyChat';
import { InputChat } from '@common/components/input/InputChat';
import { Toast } from '@common/components/toast';
import { ScrollShadow } from '@heroui/react';
import { useAuth } from '@ruby/shared/hooks';
import { useEffect, useRef, useState } from 'react';
import { ChatHistorySidebar } from './components/ChatHistorySidebar';
import { EmptyState } from './components/EmptyState';
import { Header } from './components/Header';
import { Message } from './components/Message';
import { useAiChat } from './useAiChat';
import { useAiChatHistory } from './useAiChatHistory';
export const AskAiPage = () => {
  const { data: user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    history,
    isLoading: isHistoryLoading,
    refetch: refetchHistory,
    deleteSession: deleteSessionFromHistory,
  } = useAiChatHistory({
    userId: user?.id,
    enabled: !!user?.id,
  });

  const {
    messages,
    sessionId,
    isStreaming,
    sendMessage,
    switchSession,
    newChat,
  } = useAiChat({
    userId: user?.id,
    enabled: !!user?.id,
    onError: (error) => {
      console.error('[AI Chat Error]:', error);
    },
    onSessionChange: () => {
      refetchHistory();
    },
  });

  const handleSend = (message: string) => {
    if (!message.trim() || isStreaming) return;
    sendMessage(message);
    setInputValue('');
  };

  const handleStop = () => {
    console.debug('Stop requested');
  };

  const handleNewChat = () => {
    newChat();
    refetchHistory();
  };

  const handleSelectSession = (selectedSessionId: string) => {
    if (selectedSessionId !== sessionId) {
      switchSession(selectedSessionId);
    }
  };

  const handleDeleteSession = async (deleteSessionId: string) => {
    try {
      await deleteSessionFromHistory(deleteSessionId);
      await refetchHistory();
      if (deleteSessionId === sessionId) {
        newChat();
      }
    } catch (error) {
      Toast.error({ description: `Failed to delete session: ${error}` });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <div className="h-[calc(100dvh)] bg-background flex">
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 overflow-hidden flex flex-col">
          {!hasMessages ? (
            <EmptyState sendMessage={sendMessage} isStreaming={isStreaming} />
          ) : (
            <>
              <ScrollShadow
                className="flex-1 overflow-y-auto px-6 py-6"
                size={8}
              >
                <div className="max-w-3xl mx-auto">
                  {messages.length === 0 ? (
                    <EmptyChat resourceType="resume" />
                  ) : (
                    <div className="flex flex-col gap-6">
                      {messages.map((message) => (
                        <Message
                          key={message.id}
                          message={message}
                          userImage={user?.image}
                        />
                      ))}
                      <div ref={scrollRef} />
                    </div>
                  )}
                </div>
              </ScrollShadow>

              <div className="border-t border-border bg-background px-6 py-4 shrink-0">
                <div className="max-w-3xl mx-auto">
                  <InputChat
                    placeholder="Ask me anything..."
                    value={inputValue}
                    onChange={setInputValue}
                    onSubmit={handleSend}
                    onStop={handleStop}
                    isPending={isStreaming}
                    showStopButton={isStreaming}
                  />
                  <p className="text-center text-xs text-secondary-text/50 mt-2">
                    AI responses may not always be accurate
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ChatHistorySidebar
        history={history}
        isLoading={isHistoryLoading}
        currentSessionId={sessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />
    </div>
  );
};
