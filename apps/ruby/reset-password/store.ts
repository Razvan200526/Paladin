import { create } from 'zustand';

type ResetPasswordStoreType = {
  step: number;
  email: string;
  otp: string | null;
  setStep: (step: number) => void;
  setEmail: (email: string) => void;
  setOtp: (otp: string | null) => void;
  clear: () => void;
};

export const useResetPasswordStore = create<ResetPasswordStoreType>((set) => ({
  step: 0,
  email: '',
  otp: null,
  setStep: (step) => set({ step }),
  setEmail: (email) => set({ email }),
  setOtp: (otp) => set({ otp }),
  clear: () => set({ step: 0, email: '', otp: null }),
}));
