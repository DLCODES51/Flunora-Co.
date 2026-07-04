"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import toast from "react-hot-toast";
import { Download, Trash2, Search } from "lucide-react";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminEmptyState,
} from "@/components/admin/AdminPageHeader";
import { useAccessToken, withToken } from "@/hooks/use-admin-api";
import { getNewsletterSubscribers, deleteSubscriber } from "@/functions/content";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/_dashboard/newsletter/")({
  component: AdminNewsletterPage,
});

function AdminNewsletterPage() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();
  const listFn = useServerFn(getNewsletterSubscribers);
  const deleteFn = useServerFn(deleteSubscriber);
  const [search, setSearch] = useState("");

  const { data: subscribers } = useQuery({
    queryKey: ["admin-newsletter", search],
    queryFn: () => listFn({ data: withToken({ search: search || undefined }, accessToken!) }),
    enabled: Boolean(accessToken),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-newsletter"] });

  const exportCsv = () => {
    if (!subscribers?.length) return;
    const rows = [["Email", "Subscribed At"], ...subscribers.map((s) => [
      s.email,
      new Date(s.subscribedAt).toISOString(),
    ])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminPageHeader
        title="Newsletter"
        description="Manage email subscribers."
        breadcrumbs={[{ label: "Newsletter" }]}
        actions={
          <AdminButton variant="ghost" onClick={exportCsv}>
            <Download className="h-4 w-4" /> Export CSV
          </AdminButton>
        }
      />

      <AdminCard className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscribers…"
            className="rounded-full pl-10"
          />
        </div>
      </AdminCard>

      {subscribers?.length ? (
        <div className="space-y-2">
          {subscribers.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
              style={{ border: "1.5px solid #111" }}
            >
              <div>
                <p className="font-medium">{sub.email}</p>
                <p className="text-xs text-ink/50">{new Date(sub.subscribedAt).toLocaleDateString()}</p>
              </div>
              <AdminButton
                variant="ghost"
                onClick={async () => {
                  if (!accessToken) return;
                  await deleteFn({ data: withToken({ id: sub.id }, accessToken) });
                  toast.success("Removed");
                  refresh();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </AdminButton>
            </div>
          ))}
        </div>
      ) : (
        <AdminEmptyState title="No subscribers yet" description="Newsletter signups will appear here." />
      )}
    </div>
  );
}
