import { Icon } from '@iconify/react';
import * as Sentry from '@sentry/react';
import { useState } from 'react';
import { Button } from '../button/Button';
import { Card } from '../card/Card';
import { H3, H6 } from '../typography/index';

Sentry.init({
  dsn: '',
  sendDefaultPii: true,
  environment: 'local',
  integrations: [],
});

export const ErrorFallback = ({ error }: { error: Error }) => {
  const [showDetails, setShowDetails] = useState(false);

  Sentry.captureException(error);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div
      role="alert"
      className="min-h-screen bg-linear-to-br from-primary-100 to-danger-50 flex items-center justify-center p-4"
    >
      <Card className="max-w-lg w-full p-8 text-center shadow-md flex flex-col gap-10">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 bg-danger-50 rounded-full flex items-center justify-center">
          <Icon icon="bx:error" className="text-danger size-10" />
        </div>

        {/* Error Title */}
        <H3 className="text-danger">Oops! Something went wrong</H3>

        {/* Error Description */}
        <p>
          We encountered an unexpected error. Don't worry, our team has been
          notified and we're working on a fix.
        </p>

        {/* Action Buttons */}
        <Button onPress={handleReload} className="w-full">
          Try again
        </Button>

        {/* Error Details Toggle */}
        <div className="flex flex-col gap-6 items-center">
          <Button
            onPress={() => setShowDetails(!showDetails)}
            variant="flat"
            color="danger"
            endContent={
              <Icon
                icon={
                  showDetails
                    ? 'iconamoon:arrow-up-2-duotone'
                    : 'iconamoon:arrow-down-2-duotone'
                }
                width="24"
                height="24"
              />
            }
          >
            <span>Technical details</span>
          </Button>

          {showDetails && (
            <div className="p-4 bg-dark-50 rounded flex flex-col gap-4 items-start justify-start w-full">
              <H6 className="text-sm font-semibold">Error Details:</H6>
              <pre className="text-xs text-danger whitespace-pre-wrap wrap-break-word">
                {error.message}
              </pre>
              {error.stack && (
                <details className="flex flex-col gap-2 items-start justify-start">
                  <summary className="text-xs text-dark-600 cursor-pointer hover:text-dark-800">
                    Stack trace
                  </summary>
                  <pre className="text-xs text-dark-500 whitespace-pre-wrap wrap-break-word text-left">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
