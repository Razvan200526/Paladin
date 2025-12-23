import {
  InputEmail,
  type InputEmailRefType,
  InputPassword,
  type InputPasswordRefType,
} from '@common/components/input';
import { Toast } from '@common/components/toast';
import { H3, H6 } from '@common/components/typography';
import { Button, Card, Form } from '@heroui/react';
import { backend } from '@ruby/shared/backend';
import type React from 'react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

export const SigninPage = () => {
  const navigate = useNavigate();
  const emailRef = useRef<InputEmailRefType | null>(null);
  const passwordRef = useRef<InputPasswordRefType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = emailRef.current?.getValue() || '';
    const password = passwordRef.current?.getValue() || '';

    if (emailRef.current && !emailRef.current?.isValid()) {
      Toast.error({ description: emailRef.current?.getErrorMessage() });
      return;
    }

    setIsLoading(true);

    const response = await backend.auth.signIn.email({
      email,
      password,
    });

    setTimeout(() => {
      setIsLoading(false);

      if (response.success) {
        navigate('/home/dashboard');
        setIsLoading(false);
      } else {
        passwordRef.current?.setValue('');
        Toast.error({
          description: 'Invalid email or password',
        });
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="bg-background h-[calc(100dvh)] flex flex-col gap-8 items-center justify-center px-4 sm:px-6 pt-8">
      <H3>Sign In</H3>
      <Card className="w-full max-w-120 p-8 flex flex-col gap-8">
        <Form
          className="flex flex-col gap-8 justify-center items-center"
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

          <div className="flex flex-col gap-2 w-full items-end">
            <InputPassword
              name="password"
              size="sm"
              required
              placeholder="Enter your password"
              label="Password"
              ref={passwordRef}
            />
            <Link to="/reset-password" className="text-xs font-primary">
              Forgot Password?
            </Link>
          </div>

          <Button
            className="w-full font-primary"
            type="submit"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </Form>
        <H6 className="text-center text-sm font-primary font-semibold flex items-center justify-center gap-1">
          Need to create an Account?
          <Link className="text-secondary-text font-semibold" to="/signup">
            Sign up
          </Link>
        </H6>
      </Card>
    </div>
  );
};
