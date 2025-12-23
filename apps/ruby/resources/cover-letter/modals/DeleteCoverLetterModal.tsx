import { Modal, type ModalRefType } from '@common/components/Modal';
import type { CoverLetterType } from '@sdk/types';
import type { RefObject } from 'react';
import { DeleteCoverLetterCard } from '../cards/DeleteCoverLetterCard';

type DeleteResourceModalProps = {
  modalRef: RefObject<ModalRefType | null>;
  coverletter: CoverLetterType;
};

export const DeleteCoverLetterModal = ({
  modalRef,
  coverletter,
}: DeleteResourceModalProps) => {
  return (
    <Modal
      size={'5xl'}
      className="bg-light rounded border border-border"
      modalRef={modalRef}
      hideCloseButton={true}
    >
      <DeleteCoverLetterCard modalRef={modalRef} coverletter={coverletter} />
    </Modal>
  );
};
