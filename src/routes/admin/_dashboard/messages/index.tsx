"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import { Download, Trash2, Mail, MailOpen } from "lucide-react";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminEmptyState,
} from "@/components/admin/AdminPageHeader";
import { useAccessToken, withToken } from "@/hooks/use-admin-api";
import { getMessages, updateMessageStatus, deleteMessage } from "@/functions/content";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/_dashboard/messages/")({
  component: AdminMessagesPage,
});

function AdminMessagesPage() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();
  const listFn = useServerFn(getMessages);
  const statusFn = useServerFn(updateMessageStatus);
  const deleteFn = useServerFn(deleteMessage);

  const { data: messages } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => listFn({ data: withToken({}, accessToken!) }),
    enabled: Boolean(accessToken),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] });

  const exportCsv = () => {
    if (!messages?.length) return;
    const rows = [["Name", "Email", "Message", "Status", "Date"], ...messages.map((m) => [
      m.name,
      m.email,
      `"${m.message.replace(/"/g, '""')}"`,
      m.status,
      new Date(m.createdAt).toISOString(),
    ])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contact-messages.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        description="Contact form inbox from your website."
        breadcrumbs={[{ label: "Messages" }]}
        actions={
          <AdminButton variant="ghost" onClick={exportCsv}>
            <Download className="h-4 w-4" /> Export CSV
          </AdminButton>
        }
      />

      {messages?.length ? (
        <div className="space-y-3">
          {messages.map((msg) => (
            <AdminCard key={msg.id}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{msg.name}</h3>
                    <Badge variant={msg.status === "unread" ? "default" : "secondary"} className="rounded-full capitalize">
                      {msg.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-ink/50">{msg.email}</p>
                  <p className="mt-3 text-sm text-ink/80">{msg.message}</p>
                  <p className="mt-2 text-xs text-ink/40">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <AdminButton
                    variant="ghost"
                    onClick={async () => {
                      if (!accessToken) return;
                      await statusFn({
                        data: withToken(
                          { id: msg.id, status: msg.status === "unread" ? "read" : "unread" },
                          accessToken,
                        ),
                      });
                      refresh();
                    }}
                  >
                    {msg.status === "unread" ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    onClick={async () => {
                      if (!accessToken) return;
                      await deleteFn({ data: withToken({ id: msg.id }, accessToken) });
                      toast.success("Deleted");
                      refresh();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      ) : (
        <AdminEmptyState title="Inbox zero" description="New contact messages will appear here." />
      )}
    </div>
  );
}
