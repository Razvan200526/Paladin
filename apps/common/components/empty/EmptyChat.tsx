import { MessageIcon } from '@common/icons/MessageIcon';
import { H6 } from '../typography';

export const EmptyChat = ({
  resourceType,
}: {
  resourceType: 'resume' | 'coverletter';
}) => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex items-center gap-2">
        <MessageIcon className="size-8 text-primary" />
        <H6>Chat about your {resourceType}</H6>
      </div>
    </div>
  );
};
