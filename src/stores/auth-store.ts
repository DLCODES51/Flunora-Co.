import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

let authSubscription: { unsubscribe: () => void } | null = null;

type AuthState = {
  user: User | null;
  session: Session | null;
  initialized: boolean;
  rememberMe: boolean;
  setSession: (session: Session | null) => void;
  setRememberMe: (value: boolean) => void;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getAccessToken: () => string | null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      initialized: false,
      rememberMe: true,

      setSession: (session) => {
        set({ session, user: session?.user ?? null });
      },

      setRememberMe: (rememberMe) => set({ rememberMe }),

      initialize: async () => {
        if (get().initialized) return;

        if (!isSupabaseConfigured()) {
          set({ initialized: true, session: null, user: null });
          return;
        }

        if (authSubscription) {
          authSubscription.unsubscribe();
          authSubscription = null;
        }

        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();
        set({ session: data.session, user: data.session?.user ?? null, initialized: true });

        authSubscription = supabase.auth.onAuthStateChange((_event, session) => {
          set({ session, user: session?.user ?? null });
        });
      },

      signIn: async (email, password, rememberMe = true) => {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        set({ session: data.session, user: data.user, rememberMe });
      },

      signOut: async () => {
        if (isSupabaseConfigured()) {
          const supabase = getSupabaseClient();
          await supabase.auth.signOut();
        }
        if (authSubscription) {
          authSubscription.unsubscribe();
          authSubscription = null;
        }
        set({ session: null, user: null });
      },

      resetPassword: async (email) => {
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/admin/login`,
        });
        if (error) throw error;
      },

      getAccessToken: () => get().session?.access_token ?? null,
    }),
    {
      name: "flunora-auth-store",
      partialize: (state) => ({
        rememberMe: state.rememberMe,
      }),
    },
  ),
);
