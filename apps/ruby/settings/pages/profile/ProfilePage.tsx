import { Button } from '@common/components/button';
import { InputEmail, type InputEmailRefType } from '@common/components/input';
import { InputAvatar } from '@common/components/input/InputAvatar';
import {
  InputName,
  type InputNameRefType,
} from '@common/components/input/InputFirstName';
import { Toast } from '@common/components/toast';
import { Avatar } from '@heroui/react';
import { backend } from '@ruby/shared/backend';
import { useAuth } from '@ruby/shared/hooks';
import { useRef, useState } from 'react';
import { SettingsCard } from '../../components/SettingsCard';
import { SettingsField } from '../../components/SettingsField';

export const ProfilePage = () => {
  const { data: user, refetch } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const firstNameRef = useRef<InputNameRefType | null>(null);
  const lastNameRef = useRef<InputNameRefType | null>(null);
  const emailRef = useRef<InputEmailRefType | null>(null);

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
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

      const response = await backend.users.update(user.id, payload);

      if (response.success) {
        Toast.success({ description: 'Profile updated successfully' });
        setIsEditing(false);
        await refetch();
      } else {
        Toast.error({
          description: response.message || 'Failed to update profile',
        });
      }
    } catch (error) {
      Toast.error({
        description: 'An error occurred while updating your profile',
      });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-6 w-full mx-auto space-y-6 gap-2">
      <SettingsCard
        title="Profile Information"
        description="Update your personal information and profile picture"
        className="w-full h-[calc(100dvh-9rem)]"
        footer={
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="light"
                  onPress={handleCancel}
                  isDisabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isSaving}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                color="primary"
                variant="flat"
                onPress={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        }
      >
        <div className="flex items-center gap-6 pb-4 border-b border-border">
          <Avatar
            src={user?.image}
            size="lg"
            color="primary"
            isBordered
            className="w-20 h-20"
            name={user?.name}
          />
          <div className="flex-1">
            <h4 className="font-semibold text-primary">{user?.name}</h4>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <SettingsField
          label="Profile Picture URL"
          description="Enter a URL for your profile picture"
        >
          <InputAvatar
            size={20}
            value={imageUrl || user?.image}
            onAvatarChange={(url) => {
              setImageUrl(url);
            }}
          />
        </SettingsField>

        <div className="flex flex-col space-y-4">
          <SettingsField className="w-1/3">
            <InputName
              label="First Name"
              ref={firstNameRef}
              onChange={(e) => {
                firstNameRef.current?.setValue(e);
              }}
              placeholder={user?.firstName || 'First name'}
            />
          </SettingsField>

          <SettingsField className="w-1/3">
            <InputName
              label="Last Name"
              ref={lastNameRef}
              onChange={(e) => {
                lastNameRef.current?.setValue(e);
              }}
              placeholder={user?.lastName || 'Last Name'}
            />
          </SettingsField>

          <SettingsField className="w-1/3">
            <InputEmail
              ref={emailRef}
              onChange={(e) => emailRef.current?.setValue(e)}
              placeholder={user?.email || 'example@gmail.com'}
            />
          </SettingsField>
        </div>
      </SettingsCard>
    </div>
  );
};
