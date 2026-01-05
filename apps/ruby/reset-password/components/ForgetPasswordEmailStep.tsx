import { Button } from '@common/components/button';
import { InputEmail, type InputEmailRefType } from '@common/components/input';
import { Toast } from '@common/components/toast';
import { H5 } from '@common/components/typography';
import { Form } from '@heroui/react';
import { ArrowLeftIcon } from 'lucide-react';
import { useRef } from 'react';
import { useSendResetPasswordEmail } from '../hooks';
import { useResetPasswordStore } from '../store';

export const ForgotPasswordEmailStep = () => {
  const emailRef = useRef<InputEmailRefType | null>(null);

  const { step, setEmail, setStep } = useResetPasswordStore();
  const { mutateAsync: sendResetPasswordOtp, isPending } =
    useSendResetPasswordEmail();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = emailRef.current?.getValue() || '';

    if (!email) {
      Toast.error({ description: 'Email is required' });
      return;
    }

    if (!emailRef.current?.isValid()) {
      Toast.error({ description: emailRef.current?.getErrorMessage() });
      return;
    }
    setEmail(email);
    try {
      const res = await sendResetPasswordOtp(email);
      if (!res.success) {
        throw new Error(res.message || 'Failed to send reset link');
      }
      Toast.success({ description: 'Reset link sent to your email!' });
      setStep(step + 1);
    } catch (err) {
      console.error(err);
      Toast.error({
        description: 'Failed to send reset link. Please try again.',
      });
    }
  };

  return (
    <Form
      className="flex flex-col max-w-xl items-center justify-start gap-8"
      validationBehavior="aria"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <H5>Forgot your password?</H5>
        <p className="text-sm font-normal text-secondary-text">
          No worries ,fill in your email and update it now.
        </p>
      </div>
      <InputEmail
        name="email"
        size="sm"
        className="max-w-xl"
        required
        placeholder="Enter your email"
        label="Email"
        ref={emailRef}
      />
      <div className="w-full flex justify-between">
        <Button
          variant="light"
          color="primary"
          startContent={<ArrowLeftIcon className="size-3.5" />}
        >
          Back
        </Button>

        <Button
          isLoading={isPending}
          variant="solid"
          color="primary"
          type="submit"
        >
          Send Reset Link
        </Button>
      </div>
    </Form>
  );
};
