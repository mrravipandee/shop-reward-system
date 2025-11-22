import { create } from "zustand";

export interface User {
  name: string;
  phone: string;
  dob?: string;
  photo?: string;
  coins: number;
  totalSpent?: number;
  weeklySpent?: number;
  monthlySpent?: number;
  createdAt?: string;
}

interface UserStore {
  user: User | null;
  setUser: (data: User) => void;
  clearUser: () => void;
}

// Zustand store
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (data) => set({ user: data }),
  clearUser: () => set({ user: null }),
}));
