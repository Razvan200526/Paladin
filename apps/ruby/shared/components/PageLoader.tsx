import { H1 } from '@common/components/typography';
import { Logo } from '@common/icons/Logo';
import { Progress } from '@heroui/react';

export const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-3.9rem)] w-full">
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xs h-full">
        <div className="flex items-center justify-center gap-3">
          <Logo className="size-12" />
          <H1>EasyRes</H1>
        </div>
        <Progress
          radius="sm"
          isIndeterminate
          aria-label="Loading..."
          size="lg"
          classNames={{
            indicator: 'bg-secondary',
          }}
        />
      </div>
    </div>
  );
};
