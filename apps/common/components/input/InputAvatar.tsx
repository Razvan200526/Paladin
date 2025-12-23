import { Avatar, cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useId, useState } from 'react';
import { ImageCropper } from '../images/ImageCropper';

export type InputAvatarPropsType = {
  value?: string;
  onAvatarChange?: (url: string) => void;
  size?: number;
};

export const InputAvatar = ({
  value,
  onAvatarChange,
  size = 30,
}: InputAvatarPropsType) => {
  const id = useId();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(value);
  const [imageToCrop, setImageToCrop] = useState<string | undefined>(undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedFormats = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      if (!allowedFormats.includes(file.type)) {
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImageToCrop(e.target?.result as string);
        event.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <label
        htmlFor={id}
        className="flex h-30 w-30 items-center justify-center"
      >
        <Avatar
          showFallback
          src={avatarUrl}
          className={cn(
            size &&
              `w-${size} h-${size} cursor-pointer hover:h-${size + 2} hover:w-${size + 2} transition-all duration-300`,
          )}
          color="primary"
          isBordered
          fallback={<Icon icon="mdi:user" className="size-15" />}
        />
        <input
          id={id}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      {imageToCrop ? (
        <ImageCropper
          image={imageToCrop}
          onClose={() => setImageToCrop(undefined)}
          onSave={(url: string) => {
            setAvatarUrl(url);
            setImageToCrop(undefined);
            onAvatarChange?.(url);
          }}
        />
      ) : null}
    </>
  );
};
