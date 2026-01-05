import { Card } from '@common/components/card';
import { HorizontalSteps } from '@common/components/HorizontalSteps';
import { H3 } from '@common/components/typography';
import { BackToSignIn, ForgotPasswordForm } from './components';
import { ForgotPasswordEmailStep } from './components/ForgetPasswordEmailStep';
import { ForgotPasswordOTPStep } from './components/ForgotPasswordOTPStep';
import { ForgotPasswordUpdateStep } from './components/ForgotPasswordUpdateStep';
import { useResetPasswordStore } from './store';

export const ForgotPasswordPage = () => {
  let content = <ForgotPasswordEmailStep />;

  const { step } = useResetPasswordStore();
  switch (step) {
    case 0:
      content = <ForgotPasswordEmailStep />;
      break;
    case 1:
      content = <ForgotPasswordOTPStep />;
      break;
    case 2:
      content = <ForgotPasswordUpdateStep />;
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
              title: 'OTP',
            },
            {
              title: 'Password',
            },
          ]}
        />
        <Card className="flex border border-border w-2xl flex-col gap-8 p-8">
          {content}
        </Card>
      </div>
    </div>
  );
};
