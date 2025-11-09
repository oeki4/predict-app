import { create } from "zustand";
import type { User } from "./user";

interface UserStore {
  user: User | null;
  setUser(payload: User): void;
  setCompany(payload: boolean): void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (payload) => set({ user: payload }),
  setCompany: (payload) =>
    set((state) => ({
      user: { ...(state.user as User), hasCompany: payload },
    })),
}));
