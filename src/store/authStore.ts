import { create } from "zustand";
import { supabase } from "../supabase/supabaseClient";
import type { User } from "@supabase/supabase-js";

type AuthState = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<User | null>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (currentUser) {
        await supabase.auth.getSession();

        set({ user: currentUser });
        return currentUser;
      } else {
        set({ user: null });
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ user: null });
      return null;
    }
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
