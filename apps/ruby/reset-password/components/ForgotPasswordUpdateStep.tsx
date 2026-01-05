import { Button } from '@common/components/button';
import { InputPassword } from '@common/components/input';
import { InputConfirmPassword } from '@common/components/input/InputConfirmPassword';
import { Toast } from '@common/components/toast';
import { isUserPasswordValid } from '@common/validators/isUserPasswordValid';
import {
  ArrowLeftCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Form } from '@heroui/react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useResetPassword } from '../hooks';
import { useResetPasswordStore } from '../store';

export const ForgotPasswordUpdateStep = () => {
  const [password, setPassword] = useState('');
  const { email, otp, step, setStep, clear } = useResetPasswordStore();
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { mutateAsync: resetPassword } = useResetPassword();
  const goBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isUserPasswordValid(password)) {
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

    if (password !== confirmPassword) {
      Toast.error({
        description: 'Passwords do not match',
      });
      return;
    }
    if (!otp) {
      Toast.error({
        description: 'OTP is missing. Please go back and re-enter your OTP.',
      });
      setStep(0);
      return;
    }
    const res = await resetPassword({ email, otp, password });
    if (!res.success) {
      Toast.error({
        description:
          res.message || 'Failed to reset password. Please try again.',
      });
      return;
    }
    Toast.success({
      description:
        'Password updated successfully! You can now sign in with your new password.',
    });
    clear();
    navigate('/signin');
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
        value={password}
        required
        placeholder="New Password"
        label="New Password"
        onChange={(value) => setPassword(value)}
      />

      <InputConfirmPassword
        name="password-confirmation"
        required
        password={password}
        placeholder="Confirm New Password"
        label="Confirm New Password"
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
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          endContent={<CheckCircleIcon className="size-4.5" />}
        >
          Update Password
        </Button>
      </div>
    </Form>
  );
};
