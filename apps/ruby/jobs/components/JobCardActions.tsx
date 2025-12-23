import { Button } from '@common/components/button';
import {
  ArrowTopRightOnSquareIcon,
  BookmarkIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import type { MatchStatus } from '../../../sdk/JobFetcher';

interface JobCardActionsProps {
  status: MatchStatus;
  jobUrl: string;
  isPending: boolean;
  onStatusChange: (status: MatchStatus, e: React.MouseEvent) => void;
}

export const JobCardActions = ({
  status,
  jobUrl,
  isPending,
  onStatusChange,
}: JobCardActionsProps) => {
  return (
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="light"
          isIconOnly
          isDisabled={isPending}
          onPress={(e) =>
            onStatusChange(
              status === 'saved' ? 'viewed' : 'saved',
              e as unknown as React.MouseEvent,
            )
          }
          className={status === 'saved' ? 'text-yellow-600' : ''}
        >
          {status === 'saved' ? (
            <BookmarkSolidIcon className="w-4 h-4" />
          ) : (
            <BookmarkIcon className="w-4 h-4" />
          )}
        </Button>
        <Button
          size="sm"
          variant="light"
          isIconOnly
          isDisabled={isPending || status === 'applied'}
          onPress={(e) =>
            onStatusChange('applied', e as unknown as React.MouseEvent)
          }
          className={status === 'applied' ? 'text-green-600' : ''}
        >
          <CheckCircleIcon className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="light"
          isIconOnly
          isDisabled={isPending}
          onPress={(e) =>
            onStatusChange('dismissed', e as unknown as React.MouseEvent)
          }
          className={status === 'dismissed' ? 'text-red-600' : ''}
        >
          <XCircleIcon className="w-4 h-4" />
        </Button>
      </div>
      <Button
        size="sm"
        variant="flat"
        color="primary"
        endContent={<ArrowTopRightOnSquareIcon className="w-4 h-4" />}
        onPress={() => window.open(jobUrl, '_blank')}
      >
        View Job
      </Button>
    </div>
  );
};
