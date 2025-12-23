import { Modal, type ModalRefType } from '@common/components/Modal';
import type { ResumeType } from '@sdk/types';
import type { RefObject } from 'react';
import { DeleteResumeCard } from '../cards/DeleteResumeCard';

type DeleteResourceModalProps = {
  modalRef: RefObject<ModalRefType | null>;
  resume: ResumeType;
};

export const DeleteResumeModal = ({
  modalRef,
  resume,
}: DeleteResourceModalProps) => {
  return (
    <Modal
      size={'5xl'}
      className="bg-light rounded border border-border"
      modalRef={modalRef}
      hideCloseButton={true}
    >
      <DeleteResumeCard modalRef={modalRef} resume={resume} />
    </Modal>
  );
};
