import { useRef, useState } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { dataURLtoFile } from '@common/utils';
import { backend } from '@ruby/shared/backend';
import { ButtonCancel } from '@ruby/shared/components/ButtonCancel';
import { ButtonSave } from '@ruby/shared/components/ButtonSave';
import { Modal, type ModalRefType } from '../Modal';

export type ImageCropperPropsType = {
  image: string;
  onClose: () => void;
  onSave: (url: string) => void;
  type?: 'avatar' | 'cover' | 'image';
};

export const ImageCropper = ({
  image,
  onClose,
  onSave,
  type = 'avatar',
}: ImageCropperPropsType) => {
  const modalRef = useRef<ModalRefType | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    x: 0,
    y: 0,
    width: type === 'avatar' ? 450 : 600,
    height: type === 'avatar' ? 450 : 128,
  });

  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isAvatar = type === 'avatar';
  const isImage = type === 'image';

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: Crop,
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve('');
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio;

      canvas.width = crop.width * pixelRatio * scaleX;
      canvas.height = crop.height * pixelRatio * scaleY;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          } else {
            resolve('');
          }
        },
        'image/jpeg',
        0.9,
      );
    });
  };

  const onCropSave = async () => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImage = await getCroppedImg(imgRef.current, crop);
      const formData = new FormData();
      formData.append(type, dataURLtoFile(croppedImage, `${type}.jpg`));
      setIsLoading(true);
      const response = isAvatar
        ? await backend.upload.image.avatar(formData)
        : await backend.upload.image.image(formData);
      setIsLoading(false);

      onSave(response.data.url);
      setIsOpen(false);
    }
  };

  const footer = (
    <>
      <ButtonCancel
        onPress={() => {
          setIsOpen(false);
          onClose();
        }}
        disabled={isLoading}
      />

      <ButtonSave onPress={onCropSave} isLoading={isLoading} />
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      modalRef={modalRef}
      hideCloseButton
      isDismissable={false}
      footer={footer}
      footerClassName="bg-light p-4"
    >
      <div className="rounded bg-light p-4">
        <ReactCrop
          crop={crop}
          onChange={setCrop}
          circularCrop={false}
          locked={!isImage}
          aspect={isImage ? undefined : 16 / 9}
        >
          <img ref={imgRef} src={image} alt="cropping" />
        </ReactCrop>
      </div>
    </Modal>
  );
};
