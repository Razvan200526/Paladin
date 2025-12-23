import { Modal, type ModalRefType } from '@common/components/Modal';
import type { RefObject } from 'react';
import { DeleteResourceCard } from '../cards/DeleteResourceCard';

type DeleteResourceModalProps = {
  modalRef: RefObject<ModalRefType | null>;
};

export const DeleteResourceModal = ({ modalRef }: DeleteResourceModalProps) => {
  return (
    <Modal
      size={'5xl'}
      className="bg-light rounded"
      modalRef={modalRef}
      hideCloseButton={true}
    >
      <DeleteResourceCard ref={modalRef.current} />
    </Modal>
  );
};
