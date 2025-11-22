import { create } from "zustand";

interface UserData {
  name: string;
  phone: string;
  dob?: string;
  photo?: string;
  coins: number;
  totalSpent: number;
  weeklySpent: number;
  monthlySpent: number;
}

interface UserStore {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
