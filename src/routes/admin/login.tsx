"use client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { loginSchema } from "@/lib/validators/admin";
import { useAuthStore } from "@/stores/auth-store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminButton } from "@/components/admin/AdminPageHeader";
import { Toaster } from "react-hot-toast";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

function AdminLoginPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const session = useAuthStore((s) => s.session);
  const initialize = useAuthStore((s) => s.initialize);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (session) navigate({ to: "/admin", replace: true });
  }, [session, navigate]);

  const onSubmit = async (values: LoginForm) => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env");
      return;
    }
    setLoading(true);
    try {
      if (forgotMode) {
        await resetPassword(values.email);
        toast.success("Password reset email sent!");
        setForgotMode(false);
      } else {
        await signIn(values.email, values.password, values.rememberMe);
        toast.success("Welcome back!");
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(60% 50% at 50% 20%, #F5B3CB55 0%, transparent 60%), radial-gradient(50% 50% at 80% 80%, #DDF4FF 0%, transparent 60%), #FFFDFC",
      }}
    >
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[32px] bg-white p-8"
        style={{ border: "1.5px solid #111", boxShadow: "8px 8px 0 #111" }}
      >
        <div className="mb-8 text-center">
          <p className="script text-4xl text-ink">
            Flunora<span className="text-pink-deep">.</span>
          </p>
          <p className="display mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-ink/50">
            Admin Studio
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@flunora.co"
              className="rounded-2xl border-ink/20"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          {!forgotMode && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="rounded-2xl border-ink/20"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
          )}

          {!forgotMode && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.watch("rememberMe")}
                  onCheckedChange={(v) => form.setValue("rememberMe", Boolean(v))}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setForgotMode(true)}
                className="text-xs font-semibold text-ink/60 hover:text-ink hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <AdminButton type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {forgotMode ? "Send reset link" : "Sign in"}
          </AdminButton>

          {forgotMode && (
            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="w-full text-center text-xs font-semibold text-ink/60 hover:underline"
            >
              Back to login
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-xs text-ink/40">
          Secure admin access for Flunora &amp; Co.
        </p>
      </motion.div>
    </div>
  );
}
