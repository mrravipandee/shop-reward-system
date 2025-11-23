import { create } from 'zustand';
import { User } from "@/types/user"; 

// Define the state structure for the store
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  // A helper function to update parts of the user object
  updateUser: (partialUser: Partial<User>) => void;
}

// Create the store
export const useUserStore = create<UserState>((set, get) => ({
  user: null, // Initial state

  setUser: (user) => {
    set({ user });
  },

  updateUser: (partialUser) => {
    // Safely merge the partial update into the current user object
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...partialUser };
      set({ user: updatedUser });
    }
  },
}));