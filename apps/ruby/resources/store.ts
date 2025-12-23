import { create } from 'zustand';

type DeleteStoreType = {
  state: boolean;
  deletingResumeIds: string[];
  deletingCoverletterIds: string[];
  startDeleting: () => void;
  addToDeleteResumes: (id: string) => void;
  addToDeleteCoverletters: (id: string) => void;
  removeFromDeleteResumes: (id: string) => void;
  removeFromDeleteCoverletters: (id: string) => void;
  stopDeleting: () => void;
};

export const useDeleteStore = create<DeleteStoreType>((set) => ({
  state: false,
  deletingResumeIds: [],
  deletingCoverletterIds: [],
  startDeleting: () => set({ state: true }),
  addToDeleteResumes: (id: string) =>
    set((state) => ({ deletingResumeIds: [...state.deletingResumeIds, id] })),
  addToDeleteCoverletters: (id: string) =>
    set((state) => ({
      deletingCoverletterIds: [...state.deletingCoverletterIds, id],
    })),
  removeFromDeleteResumes: (id: string) =>
    set((state) => ({
      deletingResumeIds: state.deletingResumeIds.filter((item) => item !== id),
    })),
  removeFromDeleteCoverletters: (id: string) =>
    set((state) => ({
      deletingCoverletterIds: state.deletingCoverletterIds.filter(
        (item) => item !== id,
      ),
    })),
  stopDeleting: () =>
    set({ state: false, deletingResumeIds: [], deletingCoverletterIds: [] }),
}));
