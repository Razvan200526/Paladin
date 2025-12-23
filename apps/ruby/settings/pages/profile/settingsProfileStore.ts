import { createStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const SETTINGS_STORAGE_KEY = 'settings';
type SettingsDataType = {
  email: string;
  firstName: string;
  lastName: string;
  image: string;
};

export type SettingsStoreType = {
  setData: (data: SettingsDataType) => void;
  clear: () => void;
  data: SettingsDataType;
};

const DEFAULT_PROPS = {
  email: '',
  firstName: '',
  lastName: '',
  image: '',
};

export const createSettingsStore = (initalProps: SettingsDataType) => {
  return createStore<SettingsStoreType>()(
    persist(
      (set) => ({
        data: {
          ...DEFAULT_PROPS,
          ...initalProps,
        },
        setData: (data: SettingsDataType) => set({ data }),
        clear: () => {
          set({
            data: initalProps,
          });
        },
      }),
      {
        name: SETTINGS_STORAGE_KEY,
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  );
};
