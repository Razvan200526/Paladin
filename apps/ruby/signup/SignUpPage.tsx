import { Card } from '@common/components/card';
import { HorizontalSteps } from '@common/components/HorizontalSteps';
import { useSignupStore } from './signUpStore';
import { SignupEmailStep } from './steps/SignupEmailStep';
import { SignupEmailVerificationStep } from './steps/SignupEmailVerificationStep';
import { SignupPasswordStep } from './steps/SignupPasswordStep';
import { SignupProfileStep } from './steps/SignupProfileStep';

export const SignupPage = () => {
  let content = <SignupEmailStep />;

  const { step } = useSignupStore();
  switch (step) {
    case 1:
      content = <SignupPasswordStep />;
      break;
    case 2:
      content = <SignupProfileStep />;
      break;
    case 3:
      content = <SignupEmailVerificationStep />;
      break;
  }

  return (
    <div className="flex h-[calc(100dvh)] items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center gap-8 px-4 pt-8 sm:px-6">
        <HorizontalSteps
          color="primary"
          defaultStep={0}
          currentStep={step}
          steps={[
            {
              title: 'Email',
            },
            {
              title: 'Password',
            },
            {
              title: 'Profile',
            },
            {
              title: 'Verification',
            },
          ]}
        />
        <Card className="flex w-full max-w-xl flex-col gap-8 p-8">
          {content}
        </Card>
      </div>
    </div>
  );
};
