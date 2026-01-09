import { Button } from '@common/components/button';
import { InputAvatar } from '@common/components/input/InputAvatar';
import { InputName } from '@common/components/input/InputFirstName';
import { ProfessionSelector } from '@common/components/select/ProfessionSelector';
import { Textarea, type TextareaRefType } from '@common/components/Textarea';
import { Toast } from '@common/components/toast';
import { isNameValid } from '@common/validators/isNameValid';
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';
import { Form } from '@heroui/react';
import { backend } from '@ruby/shared/backend';
import { useRef } from 'react';
import { useSignupStore } from '../signUpStore';

export const SignupProfileStep = () => {
  const { data, setStep, setData } = useSignupStore();

  const bioRef = useRef<TextareaRefType | null>(null);
  const professionRef = useRef<HTMLInputElement | null>(null);

  const goBack = () => {
    setData({ ...data, password: '' });
    setStep(1);
  };

  const handleSignup = async () => {
    if (!isNameValid(data.firstName)) {
      Toast.error({ description: 'Enter a valid first name' });
      return;
    }
    if (!isNameValid(data.lastName)) {
      Toast.error({ description: 'Enter a valid last name' });
      return;
    }

    const res = await backend.auth.signup.email({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
      bio: bioRef.current?.getValue() || '',
      profession: professionRef.current?.value || '',
    });

    if (!res.success) {
      Toast.error({ description: 'Failed to send Email OTP' });
      return;
    }

    setStep(3);
  };

  return (
    <Form
      className="flex flex-col items-center justify-center gap-8"
      validationBehavior="aria"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        handleSignup();
      }}
    >
      <div className="flex w-full items-center justify-center">
        <InputAvatar
          value={data.image}
          onAvatarChange={(url) => {
            setData({ ...data, image: url });
          }}
        />
      </div>

      <InputName
        name="firstName"
        value={data.firstName}
        required
        placeholder="First Name"
        label="First name"
        onChange={(value) => setData({ ...data, firstName: value })}
      />

      <InputName
        name="lastName"
        value={data.lastName}
        required
        placeholder="Last Name"
        label="Last name"
        onChange={(value) => setData({ ...data, lastName: value })}
      />

      <div className="flex w-full items-center justify-center">
        <ProfessionSelector
          onChange={(e) => {
            if (professionRef.current) professionRef.current.value = e;
          }}
          ref={professionRef}
          size="sm"
          placeholder="Your current/desired job..."
        />
      </div>

      <Textarea
        ref={bioRef}
        onChange={(e) => {
          bioRef.current?.setValue(e);
        }}
        inputClassName="font-light text-sm"
        label="Bio"
        placeholder="Your bio..."
        size="md"
      />

      <div className="flex w-full gap-4">
        <Button
          type="button"
          variant="bordered"
          className="flex-1"
          startContent={<ArrowLeftCircleIcon className="size-4.5" />}
          onPress={goBack}
        >
          Password
        </Button>
        <Button
          type="submit"
          variant="solid"
          endContent={<ArrowRightCircleIcon className="size-4.5" />}
        >
          Create Account & Verify
        </Button>
      </div>
    </Form>
  );
};
