import { Button } from '@common/components/button';
import { H5 } from '@common/components/typography';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { ApplicationType } from '@sdk/types';

interface ApplicationHeaderProps {
  application: ApplicationType;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export const ApplicationInspectHeader = ({
  application,
  onEdit,
  onDelete,
  onBack,
}: ApplicationHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="flat"
          size="sm"
          isIconOnly={true}
          radius="full"
          startContent={<ArrowLeftIcon className="size-4" />}
          onPress={onBack}
        />
        <div>
          <H5 className="text-primary">
            {application.jobTitle} @ {application.employer}
          </H5>
          <p className="text-sm text-muted mt-1">
            {application.location} • Applied{' '}
            {new Date(application.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="flat"
          size="sm"
          startContent={<PencilIcon className="size-4" />}
          onPress={onEdit}
          className="hover:bg-primary-100"
        >
          Edit
        </Button>
        <Button
          variant="flat"
          size="sm"
          color="danger"
          startContent={<TrashIcon className="size-4" />}
          onPress={onDelete}
          className="hover:bg-danger/10"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
