import { Button } from '@common/components/button';
import { InputEmail, type InputEmailRefType } from '@common/components/input';
import { InputAvatar } from '@common/components/input/InputAvatar';
import {
  InputName,
  type InputNameRefType,
} from '@common/components/input/InputFirstName';
import type { InputTextRefType } from '@common/components/input/InputText';
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

  const firstNameRef = useRef<InputNameRefType | null>(null);
  const lastNameRef = useRef<InputNameRefType | null>(null);
  const emailRef = useRef<InputEmailRefType | null>(null);
  const urlRef = useRef<InputTextRefType | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    image: user?.image || '',
  });

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const response = await backend.users.update(user.id, {
        name: formData.name,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        image: formData.image,
      });

      if (response.success) {
        Toast.success({ description: 'Profile updated successfully' });
        setIsEditing(false);
        refetch();
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
    setFormData({
      name: user?.name || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      image: user?.image || '',
    });
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
            src={formData.image || user?.image}
            size="lg"
            color="primary"
            isBordered
            className="w-20 h-20"
            name={formData.name || user?.name}
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
            value={urlRef.current?.getValue()}
            onAvatarChange={(url) => {
              urlRef.current?.setValue(url);
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
              onChange={(e) => emailRef.current?.setValue(e)}
              placeholder={user?.email || 'example@gmail.com'}
            />
          </SettingsField>
        </div>
      </SettingsCard>
    </div>
  );
};
