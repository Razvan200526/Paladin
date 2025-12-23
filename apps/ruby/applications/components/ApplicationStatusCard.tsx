import { H4 } from '@common/components/typography';
import { Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';
import { statusConfig } from '../utils/applicationData';

interface ApplicationStatusCardProps {
  application: ApplicationType;
}

const platformConfig = {
  Linkedin: {
    icon: 'mdi:linkedin',
    color: 'text-[#0077B5]',
    label: 'LinkedIn',
  },
  Glassdoor: {
    icon: 'simple-icons:glassdoor',
    color: 'text-[#0CAA41]',
    label: 'Glassdoor',
  },
  Other: {
    icon: 'heroicons:briefcase',
    color: 'text-primary',
    label: 'Other',
  },
};
export const ApplicationStatusCard = ({
  application,
}: ApplicationStatusCardProps) => {
  const statusInfo =
    statusConfig[application.status as keyof typeof statusConfig];
  const platformInfo =
    platformConfig[application.platform as keyof typeof platformConfig];

  return (
    <div className="bg-light border border-border rounded-lg p-6">
      <H4 className="mb-4 flex items-center gap-2">
        <Icon
          icon="heroicons:clipboard-document-check"
          className="size-5 text-primary"
        />
        Status & Details
      </H4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-sm text-muted">Application Status</span>
          <div className="flex items-center gap-2">
            <Chip
              size="md"
              className={`${statusInfo.color} border font-semibold`}
            >
              {statusInfo.label}
            </Chip>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm text-muted">Platform</span>
          <div className="flex items-center gap-2">
            <Icon
              icon={platformInfo.icon}
              className={`size-5 ${platformInfo.color}`}
            />
            <span className="text-sm text-primary font-semibold">
              {platformInfo.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
