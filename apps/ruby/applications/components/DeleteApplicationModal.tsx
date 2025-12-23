import { Button } from '@common/components/button';
import { Modal, type ModalRefType } from '@common/components/Modal';
import { Toast } from '@common/components/toast';
import { H5, P } from '@common/components/typography';
import { Icon } from '@iconify/react';
import { useAuth } from '@ruby/shared/hooks';
import type { ApplicationType } from '@sdk/types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDeleteApplication } from '../hooks/applicationHooks';

interface DeleteApplicationModalProps {
  modalRef: React.RefObject<ModalRefType | null>;
  application: ApplicationType;
}

export const DeleteApplicationModal = ({
  modalRef,
  application,
}: DeleteApplicationModalProps) => {
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMutation = useDeleteApplication(user?.id || '');

  const handleDelete = async () => {
    if (!user?.id) {
      Toast.error({
        description: 'Could not delete application, try again later',
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteMutation.mutateAsync({
        applicationIds: [application.id],
      });

      if (response.success) {
        Toast.success({
          description: 'Application deleted successfully',
        });
        modalRef.current?.close();
        navigate('/home/applications');
      } else {
        Toast.error({
          description: response.message || 'Failed to delete application',
        });
      }
    } catch (error) {
      console.error(error);
      Toast.error({
        description: 'An error occurred while deleting the application',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      modalRef={modalRef}
      size="md"
      className="bg-light rounded p-6"
      hideCloseButton={false}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-danger/10 rounded-full">
            <Icon
              icon="heroicons:exclamation-triangle"
              className="size-6 text-danger"
            />
          </div>
          <H5>Delete Application</H5>
        </div>

        <div className="space-y-4">
          <P className="text-secondary-text">
            Are you sure you want to delete the application for{' '}
            <span className="font-semibold text-primary">
              {application.jobTitle}
            </span>{' '}
            at{' '}
            <span className="font-semibold text-primary">
              {application.employer}
            </span>
            ?
          </P>

          <div className="p-4 bg-danger/5 border border-danger/20 rounded">
            <P className="text-sm text-danger">
              <Icon
                icon="heroicons:information-circle"
                className="size-4 inline mr-1"
              />
              This action cannot be undone. All associated data will be
              permanently removed.
            </P>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="light"
            onPress={() => modalRef.current?.close()}
            isDisabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={isDeleting}
            startContent={
              !isDeleting && <Icon icon="heroicons:trash" className="size-4" />
            }
          >
            Delete Application
          </Button>
        </div>
      </div>
    </Modal>
  );
};
