import { H4 } from '@common/components/typography';
import { Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';
import { statusConfig } from '../utils/applicationData';

interface ApplicationQuickInfoCardProps {
  application: ApplicationType;
}

export const ApplicationQuickInfoCard = ({
  application,
}: ApplicationQuickInfoCardProps) => {
  const statusInfo =
    statusConfig[application.status as keyof typeof statusConfig];

  return (
    <div className="bg-light border border-border rounded-lg p-5">
      <H4 className="mb-4 flex items-center gap-2">
        <Icon
          icon="heroicons:information-circle"
          className="size-5 text-primary"
        />
        Quick Info
      </H4>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-2 rounded hover:bg-background transition-colors">
          <span className="text-sm text-muted flex items-center gap-2">
            <Icon icon="heroicons:calendar" className="size-4" />
            Applied
          </span>
          <span className="text-sm font-semibold">
            {new Date(application.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 rounded hover:bg-background transition-colors">
          <span className="text-sm text-muted flex items-center gap-2">
            <Icon icon="heroicons:clock" className="size-4" />
            Last Updated
          </span>
          <span className="text-sm font-semibold">
            {new Date(application.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 rounded hover:bg-background transition-colors">
          <span className="text-sm text-muted flex items-center gap-2">
            <Icon icon="heroicons:flag" className="size-4" />
            Status
          </span>
          <Chip
            size="sm"
            className={`${statusInfo.color} border font-semibold`}
          >
            {statusInfo.label}
          </Chip>
        </div>
      </div>
    </div>
  );
};
