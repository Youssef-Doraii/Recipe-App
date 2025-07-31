import { create } from "zustand";
import { supabase } from "../supabase/supabaseClient";
import type { User } from "@supabase/supabase-js";

type AuthState = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    set({ loading: true });
    const { data } = await supabase.auth.getUser();
    set({ user: data.user ?? null, loading: false });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
