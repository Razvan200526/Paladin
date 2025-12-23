import { H3 } from '@common/components/typography';
import { ResourceIcon } from '@common/icons/ResourceIcon';
import { ResumeIcon } from '@common/icons/ResumeIcon';
import { formatDate } from '@common/utils';
import { Card, CardBody, cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { ChatSession } from '../hooks';

export const ChatCard = ({
  session,
  handleChatClick,
}: {
  session: ChatSession;
  handleChatClick: (session: ChatSession) => void;
}) => {
  return (
    <Card
      key={session.id}
      isPressable={true}
      onPress={() => handleChatClick(session)}
      shadow="none"
      className="border border-border"
    >
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg ${
              session.resourceType === 'resume'
                ? 'bg-resume/10 text-resume'
                : 'bg-coverletter/10 text-coverletter'
            }`}
          >
            {session.resourceType === 'resume' ? (
              <ResumeIcon className="size-3.5" />
            ) : (
              <ResourceIcon className="size-3.5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <H3
                  className={cn(
                    'text-sm truncate',
                    session.resourceType === 'resume'
                      ? 'text-resume'
                      : 'text-coverletter',
                  )}
                >
                  {session.resourceName}
                </H3>
                <p className="text-xs text-secondary-text font-semibold mt-1">
                  {session.resourceType === 'resume'
                    ? 'Resume'
                    : 'Cover Letter'}{' '}
                  • {session.messageCount} messages
                </p>
              </div>
            </div>

            {session.lastMessage && (
              <div className="flex flex-row items-center justify-center gap-2 py-2">
                <p className="text-xs text-muted font-semibold">
                  {formatDate(session.lastMessageAt)} :
                </p>
                <H3
                  className={cn(
                    'text-sm font-semibold line-clamp-2',
                    session.resourceType === 'resume'
                      ? 'text-resume'
                      : 'text-coverletter',
                  )}
                >
                  {session.lastMessage}
                </H3>
              </div>
            )}
          </div>

          <div className="shrink-0">
            <Icon
              icon="heroicons:chevron-right"
              className="w-4 h-4 text-muted"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
