import { Button } from '@common/components/button';
import { H6 } from '@common/components/typography';
import { Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';

export const DocumentsSection = ({
  application,
}: {
  application: ApplicationType;
}) => {
  return (
    <div>
      {(application.resume || application.coverletter) && (
        <>
          <Divider />
          <div>
            <H6 className="text-primary mb-3">Attached Documents</H6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {application.resume && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-light border border-border hover:border-blue-500/30 transition-colors cursor-pointer">
                  <div className="p-2.5 rounded-lg bg-blue-500/10">
                    <Icon
                      icon="heroicons:document-text"
                      className="size-5 text-blue-600"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary">Resume</p>
                    <p className="text-xs text-muted truncate">
                      {application.resume.name}
                    </p>
                  </div>
                  <Button variant="light" size="sm" isIconOnly radius="full">
                    <Icon icon="heroicons:eye" className="size-4" />
                  </Button>
                </div>
              )}
              {application.coverletter && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-light border border-border hover:border-green-500/30 transition-colors cursor-pointer">
                  <div className="p-2.5 rounded-lg bg-green-500/10">
                    <Icon
                      icon="heroicons:document-text"
                      className="size-5 text-green-600"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary">
                      Cover Letter
                    </p>
                    <p className="text-xs text-muted truncate">
                      {application.coverletter.name}
                    </p>
                  </div>
                  <Button variant="light" size="sm" isIconOnly radius="full">
                    <Icon icon="heroicons:eye" className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
