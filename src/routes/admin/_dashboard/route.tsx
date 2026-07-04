import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/admin/AdminDashboardLayout";

export const Route = createFileRoute("/admin/_dashboard")({
  component: AdminDashboardLayout,
});
