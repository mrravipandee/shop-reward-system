import { create } from "zustand";

// Interface for the core user data structure
export interface UserData {
  name: string;
  phone: string;
  dob?: string;       
  photo?: string;    
  coins: number;    
  totalSpent: number;
  weeklySpent: number;
  monthlySpent: number;
}

// Interface for the store's state and actions
interface UserStore {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  clearUser: () => void;
  
  // Optional: Add an action to update coins specifically, which is good practice for derived state changes
  updateCoins: (newCoins: number) => void;
}

// Create the Zustand store
export const useUserStore = create<UserStore>((set) => ({
  // Initial State
  user: null,

  // Actions
  setUser: (user) => set({ user }),
  
  clearUser: () => set({ user: null }),
  
  // Action to update coins safely and locally within the store
  updateCoins: (newCoins) => set((state) => {
    // Check if the user object exists before attempting to update coins
    if (!state.user) {
      console.warn("Attempted to update coins, but user is null.");
      return state;
    }
    return {
      user: {
        ...state.user,
        coins: newCoins,
      }
    };
  }),
}));