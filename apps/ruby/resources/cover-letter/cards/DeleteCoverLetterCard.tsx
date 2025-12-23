import { Button } from '@common/components/button';
import { Card } from '@common/components/card';
import type { ModalRefType } from '@common/components/Modal';
import { Toast } from '@common/components/toast';
import { H6 } from '@common/components/typography';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@ruby/shared/hooks';
import type { CoverLetterType } from '@sdk/types';
import type { RefObject } from 'react';
import { useNavigate } from 'react-router';
import { useDeleteCoverLetters } from '../../resumes/hooks';

export const DeleteCoverLetterCard = ({
  modalRef,
  coverletter,
}: {
  modalRef: RefObject<ModalRefType | null>;
  coverletter: CoverLetterType;
}) => {
  const { data: user } = useAuth();
  const { mutateAsync: deleteCoverLetters } = useDeleteCoverLetters(
    user?.id || '',
  );
  const navigate = useNavigate();
  const handleCancel = () => {
    modalRef.current?.close();
    return;
  };

  const handleDelete = async () => {
    try {
      const res = await deleteCoverLetters([coverletter.id]);
      if (
        !res.success ||
        res.isUnauthorized ||
        res.isForbidden ||
        res.isNotFound
      ) {
        Toast.error({
          description: 'Failed to delete cover letter. Try again later',
        });
        modalRef.current?.close();
      } else if (res.success) {
        Toast.success({
          description: 'Cover letter deleted successfully',
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
        <H6 className="text-danger">Delete Cover Letter</H6>
      </div>
      <p className="text-primary">
        Are you sure you want to delete the cover letter named{' '}
        <strong className="text-danger">{coverletter?.name}</strong>?
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
