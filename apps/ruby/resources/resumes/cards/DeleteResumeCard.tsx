import { Button } from '@common/components/button';
import { Card } from '@common/components/card';
import type { ModalRefType } from '@common/components/Modal';
import { Toast } from '@common/components/toast';
import { H6 } from '@common/components/typography';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@ruby/shared/hooks';
import type { ResumeType } from '@sdk/types';
import type { RefObject } from 'react';
import { useNavigate } from 'react-router';
import { useDeleteResumes } from '../hooks';

export const DeleteResumeCard = ({
  modalRef,
  resume,
}: {
  modalRef: RefObject<ModalRefType | null>;
  resume: ResumeType;
}) => {
  const { data: user } = useAuth();
  const { mutateAsync: deleteResume } = useDeleteResumes(user?.id || '');
  const navigate = useNavigate();
  const handleCancel = () => {
    modalRef.current?.close();
    return;
  };

  const handleDelete = async () => {
    try {
      const res = await deleteResume([resume.id]);
      if (
        !res.success ||
        res.isUnauthorized ||
        res.isForbidden ||
        res.isNotFound
      ) {
        Toast.error({
          description: 'Failed to delete resume.Try again later',
        });
        modalRef.current?.close();
      } else if (res.success) {
        Toast.success({
          description: 'Resume deleted successfully',
        });
        modalRef.current?.close();
      }
      navigate('/home/resources');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="rounded border-danger/10 bg-danger/5 flex flex-col gap-4 p-6">
      <div className="flex items-center gap-2">
        <ExclamationCircleIcon className="size-8 text-danger" />
        <H6 className="text-danger">Delete Resume</H6>
      </div>
      <p className="text-primary">
        Are you sure you want to delete the resume named{' '}
        <strong className="text-danger">{resume?.name}</strong>?
      </p>
      <p className="text-muted">
        This action is permanent and cannot be undone.
      </p>

      <div className="flex flex-row gap-4 justify-end mt-4">
        <Button variant="light" color="primary" onPress={handleCancel}>
          Cancel
        </Button>
        <Button variant="solid" color="danger" onPress={handleDelete}>
          Delete Forever
        </Button>
      </div>
    </Card>
  );
};
