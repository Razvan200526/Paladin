import { Button } from '@common/components/button';
import { Modal, type ModalRefType } from '@common/components/Modal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CreateCoverLetterCard } from '@ruby/resources/cover-letter/cards/CreateCoverLetterCard';
import { useRef } from 'react';
import { CreateResumeCard } from '../cards/CreateResumeCard';

export const CreateResourceModal = () => {
  const ref = useRef<ModalRefType | null>(null);

  return (
    <>
      <Button
        variant="flat"
        isIconOnly={true}
        radius="md"
        onPress={() => ref.current?.open()}
      >
        <PlusIcon className="size-4" />
      </Button>

      <Modal
        size={'5xl'}
        className="bg-background rounded"
        modalRef={ref}
        hideCloseButton={true}
      >
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CreateResumeCard />
          <CreateCoverLetterCard />
        </div>
      </Modal>
    </>
  );
};
