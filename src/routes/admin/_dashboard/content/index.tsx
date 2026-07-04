"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import toast from "react-hot-toast";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin/AdminPageHeader";
import { useAccessToken, withToken } from "@/hooks/use-admin-api";
import { getCmsContent, upsertCmsContent } from "@/functions/content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/_dashboard/content/")({
  component: AdminContentPage,
});

function AdminContentPage() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();
  const listFn = useServerFn(getCmsContent);
  const saveFn = useServerFn(upsertCmsContent);
  const [saving, setSaving] = useState<string | null>(null);

  const { data: cms, isLoading } = useQuery({
    queryKey: ["admin-cms"],
    queryFn: () => listFn({ data: withToken({}, accessToken!) }),
    enabled: Boolean(accessToken),
  });

  const getContent = (key: string) =>
    (cms?.find((c) => c.key === key)?.content as Record<string, unknown>) ?? {};

  const saveSection = async (key: string, section: string, content: Record<string, unknown>) => {
    if (!accessToken) return;
    setSaving(key);
    try {
      await saveFn({ data: withToken({ payload: { key, section, content } }, accessToken) });
      toast.success(`${key} saved`);
      queryClient.invalidateQueries({ queryKey: ["admin-cms"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(null);
    }
  };

  if (isLoading) return <Skeleton className="h-96 rounded-3xl" />;

  return (
    <div>
      <AdminPageHeader
        title="Website Content"
        description="Edit homepage, about, contact, and footer without touching code."
        breadcrumbs={[{ label: "Content" }]}
      />

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-2 rounded-2xl bg-white p-2">
          {["hero", "about", "contact", "footer", "announcement"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="rounded-xl capitalize">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="hero">
          <CmsHeroForm
            content={getContent("hero")}
            saving={saving === "hero"}
            onSave={(content) => saveSection("hero", "homepage", content)}
          />
        </TabsContent>
        <TabsContent value="about">
          <CmsAboutForm
            content={getContent("about")}
            saving={saving === "about"}
            onSave={(content) => saveSection("about", "about", content)}
          />
        </TabsContent>
        <TabsContent value="contact">
          <CmsContactForm
            content={getContent("contact")}
            saving={saving === "contact"}
            onSave={(content) => saveSection("contact", "contact", content)}
          />
        </TabsContent>
        <TabsContent value="footer">
          <CmsFooterForm
            content={getContent("footer")}
            saving={saving === "footer"}
            onSave={(content) => saveSection("footer", "footer", content)}
          />
        </TabsContent>
        <TabsContent value="announcement">
          <CmsAnnouncementForm
            content={getContent("announcement")}
            saving={saving === "announcement"}
            onSave={(content) => saveSection("announcement", "homepage", content)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CmsHeroForm({
  content,
  saving,
  onSave,
}: {
  content: Record<string, unknown>;
  saving: boolean;
  onSave: (c: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState({
    heading: String(content.heading ?? ""),
    subheading: String(content.subheading ?? ""),
    description: String(content.description ?? ""),
    primaryButton: String(content.primaryButton ?? ""),
    secondaryButton: String(content.secondaryButton ?? ""),
    badge: String(content.badge ?? ""),
  });
  return (
    <AdminCard className="space-y-4">
      {(["heading", "subheading", "description", "primaryButton", "secondaryButton", "badge"] as const).map(
        (field) => (
          <div key={field} className="space-y-2">
            <Label className="capitalize">{field}</Label>
            {field === "description" ? (
              <Textarea
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="rounded-2xl"
              />
            ) : (
              <Input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="rounded-2xl"
              />
            )}
          </div>
        ),
      )}
      <AdminButton onClick={() => onSave(form)} disabled={saving}>
        {saving ? "Saving…" : "Save Hero"}
      </AdminButton>
    </AdminCard>
  );
}

function CmsAboutForm({
  content,
  saving,
  onSave,
}: {
  content: Record<string, unknown>;
  saving: boolean;
  onSave: (c: Record<string, unknown>) => void;
}) {
  const [title, setTitle] = useState(String(content.title ?? ""));
  const [tagline, setTagline] = useState(String(content.tagline ?? ""));
  const [paragraphs, setParagraphs] = useState(
    Array.isArray(content.paragraphs) ? content.paragraphs.join("\n\n") : "",
  );
  return (
    <AdminCard className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Label>Paragraphs (separate with blank line)</Label>
        <Textarea value={paragraphs} onChange={(e) => setParagraphs(e.target.value)} className="min-h-32 rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Label>Tagline</Label>
        <Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="rounded-2xl" />
      </div>
      <AdminButton
        onClick={() =>
          onSave({ title, tagline, paragraphs: paragraphs.split("\n\n").filter(Boolean) })
        }
        disabled={saving}
      >
        Save About
      </AdminButton>
    </AdminCard>
  );
}

function CmsContactForm({
  content,
  saving,
  onSave,
}: {
  content: Record<string, unknown>;
  saving: boolean;
  onSave: (c: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState({
    instagram: String(content.instagram ?? ""),
    whatsapp: String(content.whatsapp ?? ""),
    email: String(content.email ?? ""),
    mapsEmbed: String(content.mapsEmbed ?? ""),
  });
  return (
    <AdminCard className="space-y-4">
      {(["instagram", "whatsapp", "email", "mapsEmbed"] as const).map((field) => (
        <div key={field} className="space-y-2">
          <Label className="capitalize">{field}</Label>
          <Input
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="rounded-2xl"
          />
        </div>
      ))}
      <AdminButton onClick={() => onSave(form)} disabled={saving}>
        Save Contact
      </AdminButton>
    </AdminCard>
  );
}

function CmsFooterForm({
  content,
  saving,
  onSave,
}: {
  content: Record<string, unknown>;
  saving: boolean;
  onSave: (c: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState({
    copyright: String(content.copyright ?? ""),
    privacyUrl: String(content.privacyUrl ?? ""),
    termsUrl: String(content.termsUrl ?? ""),
  });
  return (
    <AdminCard className="space-y-4">
      {(["copyright", "privacyUrl", "termsUrl"] as const).map((field) => (
        <div key={field} className="space-y-2">
          <Label>{field}</Label>
          <Input
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="rounded-2xl"
          />
        </div>
      ))}
      <AdminButton onClick={() => onSave(form)} disabled={saving}>
        Save Footer
      </AdminButton>
    </AdminCard>
  );
}

function CmsAnnouncementForm({
  content,
  saving,
  onSave,
}: {
  content: Record<string, unknown>;
  saving: boolean;
  onSave: (c: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState({
    enabled: Boolean(content.enabled),
    text: String(content.text ?? ""),
    link: String(content.link ?? ""),
  });
  return (
    <AdminCard className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
        Show announcement banner
      </label>
      <div className="space-y-2">
        <Label>Text</Label>
        <Input value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Label>Link</Label>
        <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="rounded-2xl" />
      </div>
      <AdminButton onClick={() => onSave(form)} disabled={saving}>
        Save Announcement
      </AdminButton>
    </AdminCard>
  );
}
