import { Button } from '@common/components/button';
import { Modal, type ModalRefType } from '@common/components/Modal';
import { ConfirmChangesCard } from './ConfirmChangesCard';
type ConfirmModalProps = {
  modalRef: React.RefObject<ModalRefType | null>;
  onConfirm: () => Promise<void> | void;
};

export const ConfirmModal = ({ modalRef, onConfirm }: ConfirmModalProps) => {
  return (
    <Modal
      size={'5xl'}
      className="bg-light rounded border border-border"
      modalRef={modalRef}
      hideCloseButton={true}
      footer={
        <div className="flex flex-row gap-2 justify-end m-4">
          <Button
            color="danger"
            variant="light"
            onPress={() => modalRef.current?.close()}
          >
            Cancel
          </Button>
          <Button variant="solid" color="primary" onPress={onConfirm}>
            Save changes
          </Button>
        </div>
      }
    >
      <ConfirmChangesCard />
    </Modal>
  );
};
