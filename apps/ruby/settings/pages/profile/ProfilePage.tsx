import { Button } from '@common/components/button';
import type { InputEmailRefType } from '@common/components/input';

import type { InputNameRefType } from '@common/components/input/InputFirstName';
import type { ModalRefType } from '@common/components/Modal';
import { Toast } from '@common/components/toast';
import { ScrollShadow } from '@heroui/react';
import { ConfirmModal } from '@ruby/settings/components/ConfirmModal';
import { useUpdateProfile } from '@ruby/settings/hooks';
import { useAuth } from '@ruby/shared/hooks';
import { useRef, useState } from 'react';
import {
  ProfileAvatarUpload,
  ProfileBio,
  ProfileForm,
  ProfileHeader,
  ProfileLinks,
  ProfilePreferences,
} from './components';

export const ProfilePage = () => {
  const { data: user, refetch } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [bio, setBio] = useState<string | undefined>(undefined);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [preferences, setPreferences] = useState<Record<string, unknown>>({});

  const modalRef = useRef<ModalRefType | null>(null);
  const firstNameRef = useRef<InputNameRefType | null>(null);
  const lastNameRef = useRef<InputNameRefType | null>(null);
  const emailRef = useRef<InputEmailRefType | null>(null);

  const { mutateAsync: updateProfile, isPending } = useUpdateProfile(
    user?.id || '',
  );

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      const firstName = firstNameRef.current?.getValue()?.trim() || undefined;
      const lastName = lastNameRef.current?.getValue()?.trim() || undefined;
      const email = emailRef.current?.getValue()?.trim() || undefined;
      const image = imageUrl || undefined;

      const payload: {
        name?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        image?: string;
      } = {};

      if (firstName) payload.firstName = firstName;
      if (lastName) payload.lastName = lastName;
      if (email) payload.email = email;
      if (image) payload.image = image;

      if (firstName || lastName) {
        payload.name =
          `${firstName || user.firstName || ''} ${lastName || user.lastName || ''}`.trim();
      }

      // TODO: Add bio, socialLinks, and preferences to payload when backend supports it
      // payload.bio = bio;
      // payload.socialLinks = socialLinks;
      // payload.preferences = preferences;

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
              name={user?.name}
              email={user?.email}
              image={imageUrl || user?.image}
            />
          </div>

          {/* Avatar Upload Section */}
          <div className="lg:col-span-1">
            <ProfileAvatarUpload
              currentImage={imageUrl || user?.image}
              onAvatarChange={(url) => setImageUrl(url)}
            />
          </div>
        </div>

        {/* Form Section - Full width */}
        <ProfileForm
          firstNameRef={firstNameRef}
          lastNameRef={lastNameRef}
          emailRef={emailRef}
          user={{
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
          }}
        />

        {/* Bio Section */}
        <ProfileBio bio={bio} onBioChange={(value) => setBio(value)} />

        {/* Two Column Layout for Links and Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Social Links */}
          <ProfileLinks
            links={socialLinks}
            onLinksChange={(links) => setSocialLinks(links)}
          />

          {/* Profile Preferences */}
          <ProfilePreferences
            preferences={preferences}
            onPreferencesChange={(prefs) => setPreferences(prefs)}
          />
        </div>

        {/* Save Button */}
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
