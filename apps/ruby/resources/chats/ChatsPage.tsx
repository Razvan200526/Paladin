import { Button } from '@common/components/button';
import { AiChatIcon } from '@common/icons/AiChatIcon';
import { ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';
import { PageLoader } from '@ruby/shared/components/PageLoader';
import { useAuth } from '@ruby/shared/hooks';
import { useNavigate } from 'react-router';
import { EmptyState } from '../EmptyState';
import { useChatSessions } from '../hooks';
import { ChatCard } from './ChatCard';

interface ChatSession {
  id: string;
  resourceType: 'resume' | 'coverletter';
  resourceId: string;
  resourceName: string;
  lastMessageAt: Date;
  messageCount: number;
  lastMessage: string;
}

export const ChatsPage = () => {
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const {
    data: chatSessions,
    isFetching,
    isError,
  } = useChatSessions(user?.id || '');

  const handleChatClick = (session: ChatSession) => {
    const basePath =
      session.resourceType === 'resume' ? 'resumes' : 'coverletters';
    navigate(`/home/resources/${basePath}/${session.resourceId}`);
  };

  if (isFetching) return <PageLoader />;

  if (isError) {
    return (
      <div className="h-[calc(100dvh-7rem)] m-4">
        <div className="flex items-center justify-center h-full border border-border rounded">
          <div className="text-center">
            <Icon
              icon="heroicons:exclamation-triangle"
              className="mx-auto h-12 w-12 text-danger"
            />
            <h3 className="mt-2 text-sm font-medium text-chats">
              Failed to load chats
            </h3>
            <p className="mt-1 text-sm text-muted">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!chatSessions || chatSessions.length === 0) {
    return (
      <div className="h-[calc(100dvh-7rem)] m-4">
        <div className="flex items-center justify-center h-full border border-border rounded">
          <EmptyState
            icon={AiChatIcon}
            title="No chats yet"
            description="Start chatting with your resumes or cover letters to see them here."
            className="text-chats"
            action={
              <Button
                onPress={() => navigate('/home/resources')}
                variant="solid"
                className="bg-chats"
              >
                Go to Resources
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-7rem)] m-4">
      <div className="p-6 h-full border border-border rounded">
        <ScrollShadow className="h-[calc(100%-120px)]">
          <div className="space-y-3">
            {chatSessions.map((session: ChatSession) => (
              <ChatCard
                key={session.id}
                session={session}
                handleChatClick={handleChatClick}
              />
            ))}
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
};
