import { Button } from '@common/components/button';
import { InputOTP } from '@common/components/input/InputOTP';
import { Toast } from '@common/components/toast';
import { Form, Spinner } from '@heroui/react';
import { backend } from '@ruby/shared/backend';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSignupStore } from '../signUpStore';

export const SignupEmailVerificationStep = () => {
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data, clear, setStep } = useSignupStore();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const onComplete = async (otp?: string) => {
    if (!otp) {
      return;
    }

    setIsLoading(true);

    const response = await backend.auth.signup.checkOtp({
      email: data.email,
      otp,
    });
    if (!response.data.success) {
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
      const { email, password } = data;
      await backend.auth.signIn.email({ email, password });

      clear();
      navigate('/home/dashboard');
    }, 2000);
  };

  return (
    <Form
      className="flex flex-col gap-6 justify-center items-center"
      validationBehavior="aria"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <p className="text-center">
        We have sent you a verification code by email. Please check your inbox.
        Enter the code below.
      </p>

      <InputOTP isInvalid={isInvalid} onComplete={onComplete} />

      {isLoading ? <Spinner /> : null}
      <Button onPress={() => setStep(2)}>Back</Button>
    </Form>
  );
};
