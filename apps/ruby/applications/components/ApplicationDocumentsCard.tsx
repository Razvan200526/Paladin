import { Button } from '@common/components/button';
import { H4 } from '@common/components/typography';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';
import { useNavigate } from 'react-router';

interface ApplicationDocumentsCardProps {
  application: ApplicationType;
}

export const ApplicationDocumentsCard = ({
  application,
}: ApplicationDocumentsCardProps) => {
  const navigate = useNavigate();

  if (!application.resume && !application.coverletter) {
    return null;
  }

  return (
    <div className="bg-light border border-border rounded-lg p-5">
      <H4 className="mb-4 flex items-center gap-2">
        <Icon
          icon="heroicons:document-duplicate"
          className="size-5 text-primary"
        />
        Attached Documents
      </H4>
      <div className="space-y-3">
        {application.resume && (
          <div className="flex items-center gap-3 p-3 border border-border rounded hover:bg-background transition-colors cursor-pointer group">
            <div className="p-2 bg-primary-100 rounded">
              <Icon
                icon="heroicons:document-text"
                className="size-5 text-primary-600"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary truncate">
                Resume
              </p>
              <p className="text-xs text-muted truncate">
                {application.resume.name}
              </p>
            </div>
            <Button
              variant="light"
              size="sm"
              isIconOnly
              onPress={() =>
                navigate(`/home/resources/resumes/${application.resume?.id}`)
              }
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon icon="heroicons:arrow-right" className="size-4" />
            </Button>
          </div>
        )}
        {application.coverletter && (
          <div className="flex items-center gap-3 p-3 border border-border rounded hover:bg-background transition-colors cursor-pointer group">
            <div className="p-2 bg-secondary-100 rounded">
              <Icon
                icon="heroicons:document-text"
                className="size-5 text-secondary-600"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary truncate">
                Cover Letter
              </p>
              <p className="text-xs text-muted truncate">
                {application.coverletter.name}
              </p>
            </div>
            <Button
              variant="light"
              size="sm"
              isIconOnly
              onPress={() =>
                navigate(
                  `/home/resources/coverletters/${application.coverletter?.id}`,
                )
              }
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon icon="heroicons:arrow-right" className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
