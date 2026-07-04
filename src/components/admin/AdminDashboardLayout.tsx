"use client";
import { useEffect } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAuthStore } from "@/stores/auth-store";
import { Loader } from "@/components/Loader";

export function AdminDashboardLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const initialized = useAuthStore((s) => s.initialized);
  const session = useAuthStore((s) => s.session);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!initialized) return;
    if (!session && pathname !== "/admin/login") {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [initialized, session, pathname, navigate]);

  if (!initialized) {
    return <Loader duration={1200} />;
  }

  if (!session) return null;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-cream">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </SidebarInset>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "rounded-2xl border-2 border-ink font-medium",
          style: { background: "#FFFDFC", color: "#111" },
        }}
      />
    </SidebarProvider>
  );
}
