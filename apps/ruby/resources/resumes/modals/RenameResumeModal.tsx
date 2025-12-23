import { Button } from '@common/components/button';
import {
  InputText,
  type InputTextRefType,
} from '@common/components/input/InputText';
import { Modal, type ModalRefType } from '@common/components/Modal';
import { Toast } from '@common/components/toast';
import { H5 } from '@common/components/typography';
import { useAuth } from '@ruby/shared/hooks';
import type { ResumeType } from '@sdk/types';
import { useRef } from 'react';
import { useRenameResume } from '../hooks';

interface RenameResumeModalProps {
  modalRef: React.RefObject<ModalRefType | null>;
  resume: ResumeType;
  onSuccess?: () => void;
}

export const RenameResumeModal = ({
  modalRef,
  resume,
  onSuccess,
}: RenameResumeModalProps) => {
  const { data: user } = useAuth();
  const nameRef = useRef<InputTextRefType | null>(null);
  const renameMutation = useRenameResume(user?.id || '');

  const handleSubmit = async () => {
    if (!user?.id) {
      Toast.error({
        title: 'Error',
        description: 'Could not rename resume, try again later',
      });
      return;
    }
    if (!nameRef.current?.getValue()) {
      Toast.error({
        title: 'Error',
        description: 'Resume name cannot be empty',
      });
      return;
    }

    try {
      const response = await renameMutation.mutateAsync(
        nameRef.current?.getValue(),
      );

      if (response.success) {
        Toast.success({
          title: 'Success',
          description: 'Resume renamed successfully',
        });
        modalRef.current?.close();
        onSuccess?.();
      } else {
        Toast.error({
          title: 'Error',
          description: 'Failed to rename resume',
        });
      }
    } catch (error) {
      console.error(error);
      Toast.error({
        title: 'Error',
        description: 'An error occurred while renaming the resume',
      });
    }
  };

  return (
    <Modal
      modalRef={modalRef}
      size="md"
      className="bg-light rounded  p-6"
      hideCloseButton={false}
    >
      <div className="flex flex-col gap-6">
        <H5 className="text-primary">Rename</H5>

        <InputText
          ref={nameRef}
          label="Name"
          placeholder={resume.name.split('.')[0]}
          value={nameRef.current?.getValue()}
          onChange={(e) => nameRef.current?.setValue(e)}
        />

        <div className="flex gap-3 justify-end">
          <Button
            variant="light"
            color="danger"
            onPress={() => modalRef.current?.close()}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="solid"
            onPress={handleSubmit}
            isLoading={renameMutation.isPending}
          >
            Rename
          </Button>
        </div>
      </div>
    </Modal>
  );
};
