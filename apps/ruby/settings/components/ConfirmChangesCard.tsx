import { Card } from '@common/components/card';
import { H6, P } from '@common/components/typography';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export const ConfirmChangesCard = () => {
  return (
    <Card className="rounded flex flex-col gap-4 p-6 border-none">
      <div className="flex items-center gap-2">
        <ExclamationCircleIcon className="size-8 text-danger" />
        <H6 className="text-danger">Personal Information</H6>
      </div>
      <p className="text-primary">
        Are you sure you want to make these changes?
      </p>
      <P>This action is permanent and cannot be undone.</P>
    </Card>
  );
};
