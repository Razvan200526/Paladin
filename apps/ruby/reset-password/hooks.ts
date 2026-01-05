import { backend } from '@ruby/shared/backend';
import { useMutation } from '@tanstack/react-query';

export const useSendResetPasswordEmail = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await backend.auth.forgetPassword.email(email);
      if (!res.success) {
        throw new Error(res.message || 'Failed to send reset link');
      }
      return res;
    },
    mutationKey: ['send-reset-password-email'],
    retryDelay: 5 * 60 * 100,
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const res = await backend.auth.forgetPassword.checkOtp({ email, otp });
      if (!res.success) {
        throw new Error('Invalid OTP');
      }
      return res;
    },
    mutationKey: ['check-reset-password-otp'],
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({
      email,
      otp,
      password,
    }: {
      email: string;
      otp: string;
      password: string;
    }) => {
      const res = await backend.auth.forgetPassword.resetPassword({
        email,
        otp,
        password,
      });
      if (!res.success) {
        throw new Error(res.message || 'Failed to reset password');
      }
      return res;
    },
    mutationKey: ['reset-password'],
  });
};
