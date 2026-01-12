import { Button } from '@common/components/button';
import type { InputNameRefType } from '@common/components/input/InputFirstName';
import type { ModalRefType } from '@common/components/Modal';
import type { TextareaRefType } from '@common/components/Textarea';
import { Toast } from '@common/components/toast';
import { isNameValid } from '@common/validators/isNameValid';
import { ScrollShadow } from '@heroui/react';
import { ConfirmModal } from '@ruby/settings/components/ConfirmModal';
import { useUpdateProfile } from '@ruby/settings/hooks';
import { useAuth } from '@ruby/shared/hooks';
import { useRef, useState } from 'react';
import * as z from 'zod';
import {
  ProfileAvatarUpload,
  ProfileBio,
  ProfileForm,
  ProfileHeader,
} from './components';

const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .optional(),
  image: z.url().optional(),
});

export const ProfilePage = () => {
  const { data: user, refetch } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const modalRef = useRef<ModalRefType | null>(null);
  const firstNameRef = useRef<InputNameRefType | null>(null);
  const lastNameRef = useRef<InputNameRefType | null>(null);
  const professionRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile(
    user?.id || '',
  );
  const bioRef = useRef<TextareaRefType | null>(null);
  const handleSave = async () => {
    if (!user?.id) return;

    const bio = bioRef.current?.getValue() || undefined;
    const firstName = firstNameRef.current?.getValue()?.trim() || undefined;
    const lastName = lastNameRef.current?.getValue()?.trim() || undefined;
    const profession = professionRef.current?.value || undefined;
    const image = imageUrl || undefined;

    const result = profileSchema.safeParse({
      firstName,
      lastName,
      image,
    });
    if (!result.success) {
      const firstError = result.error.issues[0];
      Toast.error({ description: firstError.message });
      return;
    }

    if (firstName && !isNameValid(firstName)) {
      Toast.error({ description: 'First name contains invalid characters' });
      return;
    }
    if (lastName && !isNameValid(lastName)) {
      Toast.error({ description: 'Last name contains invalid characters' });
      return;
    }

    try {
      const payload: {
        name?: string;
        firstName?: string;
        lastName?: string;
        profession?: string;
        image?: string;
        bio?: string;
      } = {};

      if (firstName) payload.firstName = firstName;
      if (lastName) payload.lastName = lastName;
      if (profession) payload.profession = profession;
      if (image) payload.image = image;
      if (bio) payload.bio = bio;

      if (firstName || lastName) {
        payload.name =
          `${firstName || user.firstName || ''} ${lastName || user.lastName || ''}`.trim();
      }

      const response = await updateProfile(payload);

      if (response.success) {
        Toast.success({ description: 'Profile updated successfully' });
        await refetch();
      } else {
        Toast.error({
          description: response.message || 'Failed to update profile',
        });
      }
      modalRef.current?.close();
      bioRef.current?.setValue('');
    } catch (error) {
      Toast.error({
        description: 'An error occurred while updating your profile',
      });
      console.error(error);
    }
  };

  return (
    <ScrollShadow className="h-[calc(100dvh-4rem)] overflow-y-auto">
      <div className="p-6 w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ProfileHeader
              profession={user?.profession}
              name={user?.name}
              email={user?.email}
              image={imageUrl || user?.image}
            />
          </div>

          <div className="lg:col-span-1">
            <ProfileAvatarUpload
              currentImage={imageUrl || user?.image}
              onAvatarChange={(url) => setImageUrl(url)}
            />
          </div>
        </div>

        <ProfileForm
          professionRef={professionRef}
          firstNameRef={firstNameRef}
          lastNameRef={lastNameRef}
          user={{
            firstName: user?.firstName,
            lastName: user?.lastName,
          }}
        />

        <ProfileBio ref={bioRef} bio={user?.bio} />

        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            color="primary"
            size="md"
            onPress={() => modalRef.current?.open()}
            isLoading={isPending}
            className="px-8"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <ConfirmModal modalRef={modalRef} onConfirm={handleSave} />
    </ScrollShadow>
  );
};
