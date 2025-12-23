import {
  cn,
  Modal as HeroModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
  useDisclosure,
} from '@heroui/react';
import { useImperativeHandle } from 'react';

export type ModalRefType = {
  open: () => void;
  close: () => void;
};

export type ModalPropsType = ModalProps & {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  modalRef?: React.RefObject<ModalRefType | null>;
  footerClassName?: string;
  headerClassName?: string;
};

export const Modal = (props: ModalPropsType) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    modalRef,
    className,
    header,
    footer,
    footerClassName,
    headerClassName,
    ...rest
  } = props;

  useImperativeHandle(modalRef, () => {
    return {
      open() {
        onOpen();
      },
      close() {
        onClose();
      },
    };
  }, [onOpen, onClose]);

  return (
    <HeroModal
      size="2xl"
      isDismissable={true}
      isKeyboardDismissDisabled={false}
      hideCloseButton={false}
      shouldBlockScroll={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      radius="sm"
      {...rest}
      scrollBehavior="inside"
      classNames={{
        body: 'py-6',
        base: cn('border-none bg-transparent', className),
      }}
    >
      <ModalContent>
        {header ? (
          <ModalHeader className={cn('m-0 p-0', headerClassName)}>
            {header}
          </ModalHeader>
        ) : null}
        <ModalBody className="p-0">{props.children}</ModalBody>
        {footer ? (
          <ModalFooter className={cn('m-0 p-0', footerClassName)}>
            {footer}
          </ModalFooter>
        ) : null}
      </ModalContent>
    </HeroModal>
  );
};
