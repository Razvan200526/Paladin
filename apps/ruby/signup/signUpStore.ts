import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const SIGNUP_STORAGE_KEY = 'signup';

type SignupDataType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image: string;
};
type SignupStoreType = {
  step: number;
  setStep: (step: number) => void;
  data: SignupDataType;
  setData: (data: SignupDataType) => void;
  clear: () => void;
};
const DEFAULT_DATA: SignupDataType = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  image: '',
};
export const useSignupStore = create<SignupStoreType>()(
  persist(
    (set) => ({
      step: 0,
      setStep: (step: number) => set({ step }),
      data: DEFAULT_DATA,
      setData: (data: SignupDataType) => set({ data }),
      clear: () => {
        set({
          step: 0,
          data: DEFAULT_DATA,
        });
      },
    }),
    {
      name: SIGNUP_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
