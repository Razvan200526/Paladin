import { InputPassword } from '@common/components/input';
import { InputConfirmPassword } from '@common/components/input/InputConfirmPassword';
import { Toast } from '@common/components/toast';
import { isUserPasswordValid } from '@common/validators/isUserPasswordValid';
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';
import { Button, Form } from '@heroui/react';
import type React from 'react';
import { useState } from 'react';
import { useSignupStore } from '../signUpStore';

export const SignupPasswordStep = () => {
  const { data, setStep, setData } = useSignupStore();
  const [confirmPassword, setConfirmPassword] = useState('');

  const goBack = () => {
    setData({ ...data, email: '' });
    setStep(0);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isUserPasswordValid(data.password)) {
      Toast.error({
        description:
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
      });
      return;
    }

    if (!confirmPassword) {
      Toast.error({
        description: 'Make sure you confirm your password',
      });
      return;
    }

    if (data.password !== confirmPassword) {
      Toast.error({
        description: 'Passwords do not match',
      });
      return;
    }

    setStep(2);
  };

  return (
    <Form
      className="flex flex-col items-center justify-center gap-8"
      validationBehavior="aria"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <InputPassword
        name="password"
        value={data.password}
        required
        placeholder="Password"
        label="Password"
        onChange={(value) => setData({ ...data, password: value })}
      />

      <InputConfirmPassword
        name="password-confirmation"
        required
        password={data.password}
        placeholder="Confirm Password"
        label="Confirm Password"
        onChange={(value) => setConfirmPassword(value)}
      />

      <div className="flex w-full gap-4">
        <Button
          type="button"
          variant="bordered"
          className="flex-1"
          startContent={<ArrowLeftCircleIcon className="size-4.5" />}
          onPress={goBack}
        >
          Email
        </Button>
        <Button
          type="submit"
          className="flex-1"
          endContent={<ArrowRightCircleIcon className="size-4.5" />}
        >
          Profile
        </Button>
      </div>
    </Form>
  );
};
