import { H4 } from '@common/components/typography';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export const ErrorPage = () => {
  return (
    <div className="flex flex-col h-[calc(100dvh-7rem)] overflow-y-scroll bg-background">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ExclamationCircleIcon className="size-12 text-red-500 mb-4" />
        <H4 className="text-secondary-text mb-2">
          Failed to load applications
        </H4>
        <p className="text-muted text-sm">Please try refreshing the page.</p>
      </div>
    </div>
  );
};
