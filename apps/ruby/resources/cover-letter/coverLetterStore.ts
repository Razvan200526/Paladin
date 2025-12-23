import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type CoverLetterChatType = {
  message: {
    user: string;
    assistant: string;
  };
  pages: number[];
};

type CoverLetterChatStoreType = {
  data: CoverLetterChatType;
  setData: (data: CoverLetterChatType) => void;
};

const storeInstances = new Map<
  string,
  ReturnType<typeof createCoverLetterChatStore>
>();

const createCoverLetterChatStore = (id: string) => {
  return create<CoverLetterChatStoreType>()(
    persist(
      (set) => ({
        data: { message: { user: '', assistant: '' }, pages: [] },
        setData: (data: CoverLetterChatType) => set({ data }),
      }),
      {
        name: `coverletter-${id}-chat`,
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  );
};

export const useCoverLetterChatStore = (
  id: string,
): CoverLetterChatStoreType => {
  if (!storeInstances.has(id)) {
    storeInstances.set(id, createCoverLetterChatStore(id));
  }
  return storeInstances.get(id)?.() as CoverLetterChatStoreType;
};
