import { create } from "zustand";

interface LoaderStore {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

export const useLoaderStore = create<LoaderStore>((set) => ({
  isLoading: true,
  showLoader: () => set({ isLoading: true }),
  hideLoader: () => set({ isLoading: false }),
}));
