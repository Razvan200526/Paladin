import { Button } from '@common/components/button';
import { InputOTP } from '@common/components/input/InputOTP';
import { Toast } from '@common/components/toast';
import { H6 } from '@common/components/typography';
import { Form, Spinner } from '@heroui/react';
import { backend } from '@ruby/shared/backend';
import { useState } from 'react';
import { useVerifyOtp } from '../hooks';
import { useResetPasswordStore } from '../store';

export const ForgotPasswordOTPStep = () => {
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { email, setStep, step, setOtp } = useResetPasswordStore();
  const { mutateAsync: verifyOtp, isError, isPending } = useVerifyOtp();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const onComplete = async (otp?: string) => {
    if (!otp) {
      return;
    }

    setIsLoading(true);

    const response = await verifyOtp({
      email,
      otp,
    });
    if (!response.success) {
      Toast.error({ description: 'Invalid OTP' });
      setIsInvalid(true);
      setIsLoading(false);
      return;
    }

    setTimeout(async () => {
      setIsLoading(false);

      if (!response.success) {
        setIsInvalid(true);
      }

      setOtp(otp);
      setStep(step + 1);
    }, 2000);
  };

  return (
    <Form
      className="flex flex-col gap-6 justify-center items-center"
      validationBehavior="aria"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <H6>Check your email</H6>
      <p className="text-center text-muted">
        We have sent you a verification code at{' '}
        <span className="text-sm text-secondary-text">{email}</span>. Please
        check your inbox. Enter the code below.
      </p>

      <InputOTP isInvalid={isInvalid} onComplete={onComplete} />

      {isLoading || isPending ? <Spinner /> : null}
      <Button onPress={() => setStep(step - 1)}>Back</Button>
    </Form>
  );
};
