import { H4 } from '@common/components/typography';
import { ApplicationsIcon } from '@common/icons/ApplicationsIcon';
import { Chip, Divider, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';
import { platformConfig } from '../utils/applicationData';
import { CurrencyDollarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { StatusDropdown } from './StatusBreakdown';
import { QuickStats } from './QuickStats';
import { DocumentsSection } from './DocumentsSection';
import { NotesSection } from './NotesSection';
import { SuggestionsSections } from './SuggestionsSections';

export const ApplicationDetails = ({
  application,
}: {
  application: ApplicationType;
}) => {
  const platformInfo =
    platformConfig[application.platform as keyof typeof platformConfig];

  return (
    <ScrollShadow className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-primary/10 shrink-0">
              <ApplicationsIcon className="size-8 text-primary" />
            </div>
            <div>
              <H4 className="text-primary text-xl">{application.jobTitle}</H4>
              <p className="text-secondary-text text-base">
                {application.employer}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-background border border-border"
                  startContent={
                    <Icon
                      icon={platformInfo.icon}
                      className={`size-3.5 ${platformInfo.color}`}
                    />
                  }
                >
                  {platformInfo.label}
                </Chip>
                {application.location && (
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-background border border-border"
                    startContent={
                      <MapPinIcon className="size-3.5 text-muted" />
                    }
                  >
                    {application.location}
                  </Chip>
                )}
                {application.salaryRange && (
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-green-500/10 text-green-700 border-green-500/20"
                    startContent={<CurrencyDollarIcon className="size-3.5" />}
                  >
                    {application.salaryRange}
                  </Chip>
                )}
              </div>
            </div>
          </div>

          <StatusDropdown application={application} />
        </div>

        <Divider />

        <div className="flex flex-col space-y-2">
          <QuickStats application={application} />

          <DocumentsSection application={application} />

          <NotesSection application={application} />

          <SuggestionsSections application={application} />
        </div>
      </div>
    </ScrollShadow>
  );
};
