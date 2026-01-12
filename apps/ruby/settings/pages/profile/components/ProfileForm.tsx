import { Card } from '@common/components/card';
import {
  InputName,
  type InputNameRefType,
} from '@common/components/input/InputFirstName';
import { ProfessionSelector } from '@common/components/select/ProfessionSelector';
import { H6 } from '@common/components/typography';
import { Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { RefObject } from 'react';

interface ProfileFormProps {
  firstNameRef: RefObject<InputNameRefType | null>;
  lastNameRef: RefObject<InputNameRefType | null>;
  professionRef: RefObject<HTMLInputElement | null>;
  user?: {
    firstName?: string;
    lastName?: string;
    profession?: string;
  };
}

export const ProfileForm = ({
  firstNameRef,
  lastNameRef,
  professionRef,
  user,
}: ProfileFormProps) => {
  return (
    <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon
              icon="heroicons:user-circle"
              className="size-5 text-primary"
            />
          </div>
          <div>
            <H6 className="text-primary">Personal Information</H6>
            <p className="text-xs text-secondary-text">
              Update your personal details
            </p>
          </div>
        </div>

        <Divider className="bg-border" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputName
            label="First Name"
            ref={firstNameRef}
            onChange={(e) => {
              firstNameRef.current?.setValue(e);
            }}
            placeholder={user?.firstName || 'First name'}
          />

          <InputName
            label="Last Name"
            ref={lastNameRef}
            onChange={(e) => {
              lastNameRef.current?.setValue(e);
            }}
            placeholder={user?.lastName || 'Last Name'}
          />

          <ProfessionSelector
          placeholder={user?.profession}
            className="mt-5.5"
            ref={professionRef}
            onChange={(e) => {
              if (professionRef.current) {
                professionRef.current.value = e;
              }
            }}
          />
        </div>
      </div>
    </Card>
  );
};
