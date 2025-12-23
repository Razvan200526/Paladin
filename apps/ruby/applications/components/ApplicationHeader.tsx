import { Button } from '@common/components/button';
import { H5 } from '@common/components/typography';
import { ArrowLeftToLine, PencilIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { ApplicationType } from '../../../sdk/types';

export const ApplicationHeader = ({
  application,
}: {
  application: ApplicationType;
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          color="primary"
          variant="flat"
          size="sm"
          isIconOnly={true}
          radius="full"
          startContent={<ArrowLeftToLine className="size-3.5" />}
          onPress={() => navigate('/home/applications')}
        />
        <div className="flex items-center justify-center gap-1">
          <H5 className="text-primary font-semibold">
            {application.jobTitle} @
          </H5>
          <H5 className="text-secondary-text">{application.employer}</H5>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="light"
          size="sm"
          startContent={<PencilIcon className="size-4" />}
          isIconOnly
          className="rounded-full"
        />
        <Button
          variant="light"
          size="sm"
          color="danger"
          startContent={<TrashIcon className="size-4" />}
          isIconOnly
          className="rounded-full"
        />
      </div>
    </div>
  );
};
