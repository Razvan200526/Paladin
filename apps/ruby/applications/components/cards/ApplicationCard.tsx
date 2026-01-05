import { Card } from '@common/components/card';
import { H4 } from '@common/components/typography';
import { formatDate } from '@common/utils';
import { Chip, cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';
import { statusConfig } from '../../utils/applicationData';

const platformConfig = {
  Linkedin: {
    icon: 'mdi:linkedin',
    color: 'text-[#0077B5]',
  },
  Glassdoor: {
    icon: 'simple-icons:glassdoor',
    color: 'text-[#0CAA41]',
  },
  Other: {
    icon: 'heroicons:briefcase',
    color: 'text-primary',
  },
};

export const ApplicationCard = ({
  application,
}: {
  application: ApplicationType;
}) => {
  const statusInfo = statusConfig[application.status];
  const platformInfo = platformConfig[application.platform];

  return (
    <Card className="flex flex-col gap-3 max-w-full transition-all hover:border-border-hover duration-300 ease-in cursor-pointer group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon
              icon={platformInfo.icon}
              className={cn('size-4 shrink-0', platformInfo.color)}
            />
            <H4 className="truncate text-primary">{application.jobTitle}</H4>
          </div>
          <p className="text-sm font-semibold text-secondary-text truncate">
            {application.employer}
          </p>
        </div>

        <Chip
          size="sm"
          variant="flat"
          className={cn(
            'text-xs font-semibold px-2.5 py-0.5 border',
            statusInfo.color,
          )}
        >
          {statusInfo.label}
        </Chip>
      </div>

      <div className="flex items-center gap-4 text-xs text-primary">
        <div className="flex items-center gap-1.5">
          <Icon icon="heroicons:map-pin" className="size-3.5" />
          <span className="font-medium">{application.location}</span>
        </div>
        {application.salaryRange && (
          <>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5">
              <Icon
                icon="heroicons:banknotes"
                className="size-3.5 text-green-800"
              />
              <span className="font-medium text-secondary-text">
                {application.salaryRange}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted font-semibold">
            Updated {formatDate(application.updatedAt)}
          </p>

          {application.contact && (
            <>
              <span className="text-border text-xs">•</span>
              <div className="flex items-center gap-1">
                <Icon
                  icon="heroicons:envelope"
                  className="size-3 text-primary"
                />
                <span className="text-xs text-primary font-medium">
                  Contact
                </span>
              </div>
            </>
          )}
        </div>

        {application.jobUrl && (
          <Icon
            icon="heroicons:arrow-top-right-on-square"
            className="size-4 text-muted group-hover:text-primary transition-colors duration-200"
          />
        )}
      </div>

      {(application.comments.length > 0 ||
        application.suggestions.length > 0) && (
        <div className="flex items-center gap-3 text-xs">
          {application.comments.length > 0 && (
            <div className="flex items-center gap-1.5 text-muted">
              <Icon icon="heroicons:chat-bubble-left" className="size-3.5" />
              <span className="font-medium">
                {application.comments.length} comment
                {application.comments.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          {application.suggestions.length > 0 && (
            <div className="flex items-center gap-1.5 text-muted">
              <Icon icon="heroicons:light-bulb" className="size-3.5" />
              <span className="font-medium">
                {application.suggestions.length} suggestion
                {application.suggestions.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
