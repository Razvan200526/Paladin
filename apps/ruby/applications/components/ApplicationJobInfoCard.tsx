import { H4, H6 } from '@common/components/typography';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';

interface ApplicationJobInfoCardProps {
  application: ApplicationType;
}

export const ApplicationJobInfoCard = ({
  application,
}: ApplicationJobInfoCardProps) => {
  return (
    <div className="bg-light border border-border rounded-lg p-6">
      <H4 className="mb-4 flex items-center gap-2">
        <Icon icon="heroicons:briefcase" className="size-5 text-primary" />
        Job Information
      </H4>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-background rounded border border-border">
            <H6 className="text-xs font-semibold text-muted mb-1">Company</H6>
            <p className="text-primary font-semibold">{application.employer}</p>
          </div>
          <div className="p-3 bg-background rounded border border-border">
            <H6 className="text-xs font-semibold text-muted mb-1">Position</H6>
            <p className="text-primary font-semibold">{application.jobTitle}</p>
          </div>
          <div className="p-3 bg-background rounded border border-border">
            <H6 className="text-xs font-semibold text-muted mb-1">Location</H6>
            <p className="text-secondary-text font-medium">
              {application.location}
            </p>
          </div>
          {application.salaryRange && (
            <div className="p-3 bg-background rounded border border-border">
              <H6 className="text-xs font-semibold text-muted mb-1">
                Salary Range
              </H6>
              <p className="text-secondary-text font-medium">
                {application.salaryRange}
              </p>
            </div>
          )}
        </div>

        {application.jobUrl && (
          <div className="p-3 bg-background rounded border border-border">
            <H6 className="text-xs font-semibold text-muted mb-2">
              Job Posting
            </H6>
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-2 font-medium"
            >
              <Icon icon="heroicons:link" className="size-4" />
              View Original Posting
              <Icon
                icon="heroicons:arrow-top-right-on-square"
                className="size-3"
              />
            </a>
          </div>
        )}

        {application.contact && (
          <div className="p-3 bg-background rounded border border-border">
            <H6 className="text-xs font-semibold text-muted mb-1">
              Contact Person
            </H6>
            <p className="text-secondary-text font-medium">
              {application.contact}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
