import { H4 } from '@common/components/typography';
import type { ApplicationType } from '@sdk/types';

export const QuickStats = ({
  application,
}: {
  application: ApplicationType;
}) => {
  return (
    <div className="bg-light border border-border rounded-lg p-4">
      <H4 className="mb-4">Quick Info</H4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Applied</span>
          <span className="text-sm font-medium">
            {new Date(application.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Last Updated</span>
          <span className="text-sm font-medium">
            {new Date(application.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
