import { Button } from '@common/components/button';
import { Modal, type ModalRefType } from '@common/components/Modal';
import { PdfUploader } from '@common/components/pdf/PdfUploader';
import { Toast } from '@common/components/toast';
import { CoverLetterIcon } from '@common/icons/CoverletterIcon';
import { isUrlValid } from '@common/validators/isUrlValid';
import { backend } from '@ruby/shared/backend';
import { useRef } from 'react';
export const CreateCoverLetterButton = () => {
  const uploadPdfModalRef = useRef<ModalRefType>(null);

  const uploadCoverLetter = async (urls: string[]) => {
    if (!isUrlValid(urls[0])) {
      Toast.error({ description: 'Invalid pdf URL' });
      return;
    }

    backend.coverLetter.create({
      url: urls[0] || '',
    });
  };

  return (
    <>
      <Button
        color="primary"
        variant="ghost"
        size="sm"
        startContent={<CoverLetterIcon className="size-3.5" />}
        onPress={() => uploadPdfModalRef.current?.open()}
      >
        Upload PDF cover letter
      </Button>
      {/*<Button
        size="sm"
        className="bg-coverletter m-2"
        startContent={<PlusCircleIcon className="size-3.5" />}
        onPress={() => createModalRef.current?.open()}
      >
        Create cover letter
      </Button>*/}
      <Modal
        modalRef={uploadPdfModalRef}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        hideCloseButton={true}
        className="bg-light p-4 rounded"
      >
        <PdfUploader
          type="coverLetter"
          onUpload={(urls) => uploadCoverLetter(urls)}
        />
      </Modal>
      {/*<Modal
        modalRef={createModalRef}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        hideCloseButton={true}
        className="bg-light p-4 rounded"
      >
      </Modal>*/}
      {/*TODO : implement creating note from scratch thing.Like a mini word type of thing*/}
    </>
  );
};
