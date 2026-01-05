import { Button } from '@common/components/button';
import { InputEmail, type InputEmailRefType } from '@common/components/input';
import { Toast } from '@common/components/toast';
import { Form } from '@heroui/react';
import { useRef } from 'react';
import { useSendResetPasswordEmail } from '../hooks';

export const ForgotPasswordForm = () => {
  const emailRef = useRef<InputEmailRefType | null>(null);

  const { mutateAsync: sendResetPasswordOtp } = useSendResetPasswordEmail();
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

    try {
      const res = await sendResetPasswordOtp(email);
      if (!res.success) {
        throw new Error(res.message || 'Failed to send reset link');
      }
      Toast.success({ description: 'Reset link sent to your email!' });
    } catch (err) {
      console.error(err);
      Toast.error({
        description: 'Failed to send reset link. Please try again.',
      });
    }
  };

  return (
    <Form
      className="flex flex-col items-center justify-center gap-8"
      validationBehavior="aria"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <InputEmail
        name="email"
        size="sm"
        required
        placeholder="Enter your email"
        label="Email"
        ref={emailRef}
      />

      <Button className="w-full font-primary" type="submit">
        Send Reset Link
      </Button>
    </Form>
  );
};
