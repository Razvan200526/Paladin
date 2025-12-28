import { Button } from '@common/components/button';
import { H4 } from '@common/components/typography';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';

export const RelatedDocuments = ({
  application,
}: {
  application: ApplicationType;
}) => {
  return (
    (application.resume || application.coverletter) && (
      <div className="bg-light border border-border rounded-lg p-4">
        <H4 className="mb-4">Attached Documents</H4>
        <div className="space-y-3">
          {application.resume && (
            <div className="flex items-center gap-3 p-2 border border-border rounded">
              <Icon
                icon="heroicons:document-text"
                className="size-5 text-blue-600"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">Resume</p>
                <p className="text-xs text-muted">
                  {application?.resume?.name}
                </p>
              </div>
              <Button variant="light" size="sm">
                <Icon icon="heroicons:eye" className="size-4" />
              </Button>
            </div>
          )}
          {application.coverletter && (
            <div className="flex items-center gap-3 p-2 border border-border rounded">
              <Icon
                icon="heroicons:document-text"
                className="size-5 text-green-600"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">Cover Letter</p>
                <p className="text-xs text-muted">
                  {application?.coverletter?.name}
                </p>
              </div>
              <Button variant="light" size="sm">
                <Icon icon="heroicons:eye" className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  );
};
