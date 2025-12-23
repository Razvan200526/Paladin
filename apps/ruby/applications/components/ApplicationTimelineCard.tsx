import { H4 } from '@common/components/typography';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';
import { statusConfig } from '../utils/applicationData';

interface ApplicationTimelineCardProps {
  application: ApplicationType;
}

export const ApplicationTimelineCard = ({
  application,
}: ApplicationTimelineCardProps) => {
  const statusInfo =
    statusConfig[application.status as keyof typeof statusConfig];

  const getStatusColor = () => {
    if (statusInfo.color.includes('green')) return 'bg-green-500';
    if (statusInfo.color.includes('blue')) return 'bg-blue-500';
    if (statusInfo.color.includes('red')) return 'bg-red-500';
    return 'bg-secondary';
  };

  return (
    <div className="bg-light border border-border rounded-lg p-5">
      <H4 className="mb-4 flex items-center gap-2">
        <Icon icon="heroicons:clock" className="size-5 text-primary" />
        Timeline
      </H4>
      <div className="space-y-4">
        <div className="flex items-start gap-3 relative">
          <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0 z-10" />
          <div className="absolute left-1 top-4 bottom-0 w-px bg-border" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">
              Application Created
            </p>
            <p className="text-xs text-muted mt-1">
              {new Date(application.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 relative">
          <div
            className={`w-2 h-2 rounded-full mt-2 shrink-0 z-10 ${getStatusColor()}`}
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">
              Status: {statusInfo.label}
            </p>
            <p className="text-xs text-muted mt-1">
              {new Date(application.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
