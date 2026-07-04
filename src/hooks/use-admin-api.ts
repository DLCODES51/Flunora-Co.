import { useAuthStore } from "@/stores/auth-store";

export function useAccessToken() {
  return useAuthStore((s) => s.getAccessToken());
}

export function useAdminAuth() {
  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);
  const initialized = useAuthStore((s) => s.initialized);
  const signOut = useAuthStore((s) => s.signOut);
  return { user, session, initialized, isAuthenticated: Boolean(session), signOut };
}

export function withToken<T extends Record<string, unknown>>(payload: T, accessToken: string | null) {
  if (!accessToken) throw new Error("Not authenticated");
  return { ...payload, accessToken };
}
