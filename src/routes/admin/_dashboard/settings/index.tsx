"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import toast from "react-hot-toast";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin/AdminPageHeader";
import { useAccessToken, withToken } from "@/hooks/use-admin-api";
import { getSettings, upsertSetting } from "@/functions/content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/_dashboard/settings/")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();
  const listFn = useServerFn(getSettings);
  const saveFn = useServerFn(upsertSetting);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => listFn({ data: withToken({}, accessToken!) }),
    enabled: Boolean(accessToken),
  });

  const getValue = (key: string) =>
    (settings?.find((s) => s.key === key)?.value as Record<string, unknown>) ?? {};

  const save = async (key: string, value: Record<string, unknown>) => {
    if (!accessToken) return;
    await saveFn({ data: withToken({ payload: { key, value } }, accessToken) });
    toast.success("Settings saved");
    queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
  };

  if (isLoading) return <Skeleton className="h-96 rounded-3xl" />;

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Site-wide configuration for Flunora & Co."
        breadcrumbs={[{ label: "Settings" }]}
      />

      <Tabs defaultValue="site" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-2 rounded-2xl bg-white p-2">
          {["site", "social", "loader", "theme"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="rounded-xl capitalize">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="site">
          <SettingsForm
            initial={getValue("site")}
            fields={["name", "title", "description", "logoUrl", "faviconUrl"]}
            onSave={(value) => save("site", value)}
          />
        </TabsContent>
        <TabsContent value="social">
          <SettingsForm
            initial={getValue("social")}
            fields={["instagram", "whatsapp", "email", "phone", "address"]}
            onSave={(value) => save("social", value)}
          />
        </TabsContent>
        <TabsContent value="loader">
          <SettingsForm
            initial={getValue("loader")}
            fields={["enabled", "duration"]}
            onSave={(value) => save("loader", value)}
          />
        </TabsContent>
        <TabsContent value="theme">
          <SettingsForm
            initial={getValue("theme")}
            fields={["primaryColor", "backgroundColor"]}
            onSave={(value) => save("theme", value)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingsForm({
  initial,
  fields,
  onSave,
}: {
  initial: Record<string, unknown>;
  fields: string[];
  onSave: (value: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f, String(initial[f] ?? "")])),
  );

  return (
    <AdminCard className="space-y-4">
      {fields.map((field) => (
        <div key={field} className="space-y-2">
          <Label className="capitalize">{field.replace(/([A-Z])/g, " $1")}</Label>
          <Input
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="rounded-2xl"
          />
        </div>
      ))}
      <AdminButton
        onClick={() =>
          onSave(
            Object.fromEntries(
              fields.map((f) => [f, f === "enabled" ? form[f] === "true" : f === "duration" ? Number(form[f]) : form[f]]),
            ),
          )
        }
      >
        Save Settings
      </AdminButton>
    </AdminCard>
  );
}
