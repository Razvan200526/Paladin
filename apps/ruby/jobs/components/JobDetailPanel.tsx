import { H5 } from '@common/components/typography';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import type { JobMatch } from '../../../sdk/JobFetcher';
import { JobMatchDetail } from './JobMatchDetail';

interface JobDetailPanelProps {
  selectedMatch: JobMatch | undefined;
}

export const JobDetailPanel = ({ selectedMatch }: JobDetailPanelProps) => {
  if (selectedMatch) {
    return <JobMatchDetail match={selectedMatch} />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <BriefcaseIcon className="w-8 h-8 text-primary" />
      </div>
      <H5 className="text-primary mb-2">Select a job</H5>
      <p className="text-sm text-muted">
        Click on a job match to see detailed information
      </p>
    </div>
  );
};
