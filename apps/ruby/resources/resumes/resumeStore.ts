import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ResumeChatType = {
  message: {
    user: string;
    assistant: string;
  };
  pages: number[];
};

type ResumeChatStoreType = {
  data: ResumeChatType;
  setData: (data: ResumeChatType) => void;
};

const storeInstances = new Map<
  string,
  ReturnType<typeof createResumeChatStore>
>();

const createResumeChatStore = (id: string) => {
  return create<ResumeChatStoreType>()(
    persist(
      (set) => ({
        data: { message: { user: '', assistant: '' }, pages: [] },
        setData: (data: ResumeChatType) => set({ data }),
      }),
      {
        name: `resume-${id}-chat`,
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  );
};

export const useResumeChatStore = (id: string): ResumeChatStoreType => {
  if (!storeInstances.has(id)) {
    storeInstances.set(id, createResumeChatStore(id));
  }
  return storeInstances.get(id)?.() as ResumeChatStoreType;
};
