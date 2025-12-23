import { Button } from '@common/components/button';
import { InputEmail } from '@common/components/input';
import { Link } from '@common/components/Link';
import { Toast } from '@common/components/toast';
import { H6 } from '@common/components/typography';
import { isEmailValid } from '@common/validators/isEmailValid';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { Form } from '@heroui/react';
import { backend } from '@ruby/shared/backend';
import { useState } from 'react';
import { useSignupStore } from '../signUpStore';

export const SignupEmailStep = () => {
  const { data, setStep, setData } = useSignupStore();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEmailValid(data.email)) {
      Toast.error({
        description: 'Enter a valid email',
      });
      return;
    }
    setIsLoading(true);

    const response = await backend.users.exists(data.email);

    setIsLoading(false);

    if (!response.success && response.message) {
      Toast.error({ description: response.message });
      return;
    }
    if (response.data.exists) {
      Toast.error({ description: 'Email already exists' });
      return;
    }
    setStep(1);
  };

  return (
    <div>
      <Form
        className="flex flex-col items-center justify-center gap-8"
        validationBehavior="aria"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <InputEmail
          name="Email"
          required
          placeholder="Email"
          label="Email"
          onChange={(value) => setData({ ...data, email: value })}
        />

        <Button
          type="submit"
          className="w-full"
          endContent={<ArrowRightCircleIcon className="size-4.5" />}
          isLoading={isLoading}
        >
          Password
        </Button>
      </Form>

      <H6 className="flex items-center justify-center gap-2 pt-4 text-small">
        Already have an account?
        <Link className="text-secondary-text font-semibold" to="/signin">
          Sign In
        </Link>
      </H6>
    </div>
  );
};
