import { Card } from '@common/components/card';
import { H6 } from '@common/components/typography';
import { formatDate } from '@common/utils';
import { Checkbox, Chip } from '@heroui/react';
import type { ResumeBuilderType } from '@sdk/types';
import { FileTextIcon } from 'lucide-react';
import { useDeleteStore } from '../../store';

type ResumeBuilderCardProps = {
  resume: ResumeBuilderType;
};

export const ResumeBuilderCard = ({ resume }: ResumeBuilderCardProps) => {
  const { state, addToDeleteResumes, removeFromDeleteResumes } =
    useDeleteStore();

  // Get initials from contact name for placeholder
  const getInitials = () => {
    const name = resume.data?.contact?.fullName || resume.name;
    if (!name) return 'R';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get a preview summary
  const getPreviewText = () => {
    if (resume.data?.summary) {
      return `${resume.data.summary.substring(0, 80)}...`;
    }
    if (resume.data?.experience?.length > 0) {
      const exp = resume.data.experience[0];
      return `${exp.position} at ${exp.company}`;
    }
    return 'No content yet';
  };

  return (
    <Card className="h-62.5 relative flex flex-col border border-border transition-all duration-300 hover:border-primary/50 ease-in-out w-full">
      {/* Status chip */}
      <Chip
        size="sm"
        variant="flat"
        color={resume.status === 'published' ? 'success' : 'warning'}
        className="absolute top-1 left-1 z-50 text-xs"
      >
        {resume.status === 'published' ? 'Published' : 'Draft'}
      </Chip>

      {/* Builder badge */}
      <Chip
        size="sm"
        variant="flat"
        color="primary"
        className="absolute top-1 right-1 z-50 text-xs"
      >
        Builder
      </Chip>

      <div className="h-full w-full rounded flex items-center justify-center">
        {state && (
          <Checkbox
            radius="sm"
            className="absolute top-7 right-5 z-50"
            color="danger"
            onValueChange={(isSelected) => {
              if (isSelected) {
                addToDeleteResumes(resume.id);
              } else {
                removeFromDeleteResumes(resume.id);
              }
            }}
          />
        )}

        {/* Preview placeholder */}
        <div className="h-2/3 w-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
          {resume.thumbnailUrl ? (
            <img
              src={resume.thumbnailUrl}
              alt={resume.name}
              className="h-full w-full object-cover rounded"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <FileTextIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-xs text-secondary-text font-medium">
                  {getInitials()}
                </p>
                <p className="text-xs text-secondary-text/70 max-w-32 truncate">
                  {getPreviewText()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with name and date */}
        <div className="absolute bottom-0 left-0 z-10 w-full flex flex-col space-y-1 bg-background rounded-b-lg border-t border-border transition-all duration-300 hover:border-primary/50 h-1/3 p-4">
          <div className="flex text-center justify-center">
            <H6 className="truncate">{resume.name}</H6>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p className="text-secondary-text text-sm">
              Updated {formatDate(resume.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
