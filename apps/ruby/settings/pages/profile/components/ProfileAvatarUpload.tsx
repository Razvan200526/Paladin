import { Card } from '@common/components/card';
import { InputAvatar } from '@common/components/input/InputAvatar';
import { H6 } from '@common/components/typography';
import { Icon } from '@iconify/react';

interface ProfileAvatarUploadProps {
  currentImage?: string;
  onAvatarChange: (url: string) => void;
}

export const ProfileAvatarUpload = ({
  currentImage,
  onAvatarChange,
}: ProfileAvatarUploadProps) => {
  return (
    <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300 h-full">
      <div className="flex flex-col items-center justify-center h-full space-y-3 py-2">
        <div className="flex items-center gap-2">
          <Icon icon="heroicons:camera" className="size-4 text-primary" />
          <H6 className="text-primary text-sm">Profile Picture</H6>
        </div>

        <InputAvatar
          size={20}
          value={currentImage}
          onAvatarChange={onAvatarChange}
        />

        <p className="text-xs text-secondary-text text-center">
          Click to upload
        </p>
      </div>
    </Card>
  );
};
