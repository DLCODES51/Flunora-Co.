"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminEmptyState,
} from "@/components/admin/AdminPageHeader";
import { useAccessToken, withToken } from "@/hooks/use-admin-api";
import { getCollections, createCollection, updateCollection, deleteCollection } from "@/functions/catalog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/validators/admin";

export const Route = createFileRoute("/admin/_dashboard/collections/")({
  component: AdminCollectionsPage,
});

function AdminCollectionsPage() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();
  const listFn = useServerFn(getCollections);
  const createFn = useServerFn(createCollection);
  const updateFn = useServerFn(updateCollection);
  const deleteFn = useServerFn(deleteCollection);
  const [showForm, setShowForm] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const { data: collections } = useQuery({
    queryKey: ["admin-collections-list"],
    queryFn: () => listFn({ data: withToken({}, accessToken!) }),
    enabled: Boolean(accessToken),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-collections-list"] });

  const resetForm = () => {
    setShowForm(false);
    setEditingCollectionId(null);
    setName("");
    setDescription("");
    setThumbnailUrl("");
    setBannerUrl("");
  };

  const handleCreate = async () => {
    if (!accessToken || !name.trim()) return;

    const payload = {
      name: name.trim(),
      slug: slugify(name.trim()),
      description: description.trim() || undefined,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      bannerUrl: bannerUrl.trim() || undefined,
      visible: true,
      featured: false,
      displayOrder: 0,
    };

    if (editingCollectionId) {
      await updateFn({
        data: withToken({ id: editingCollectionId, collection: payload }, accessToken),
      });
      toast.success("Collection updated");
    } else {
      await createFn({
        data: withToken({ collection: payload }, accessToken),
      });
      toast.success("Collection created");
    }

    resetForm();
    refresh();
  };

  const handleEdit = (collection: { id: string; name: string; description: string | null; thumbnailUrl: string | null; bannerUrl: string | null }) => {
    setEditingCollectionId(collection.id);
    setName(collection.name);
    setDescription(collection.description ?? "");
    setThumbnailUrl(collection.thumbnailUrl ?? "");
    setBannerUrl(collection.bannerUrl ?? "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!accessToken || !confirm("Delete collection?")) return;
    await deleteFn({ data: withToken({ id }, accessToken) });
    toast.success("Deleted");
    refresh();
  };

  return (
    <div>
      <AdminPageHeader
        title="Collections"
        description="Editorial collection cards for the homepage."
        breadcrumbs={[{ label: "Collections" }]}
        actions={
          <AdminButton onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="h-4 w-4" /> New Collection
          </AdminButton>
        }
      />

      {showForm && (
        <AdminCard className="mb-6 space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-2xl" />
          </div>
          <div className="space-y-2">
            <Label>Thumbnail URL</Label>
            <Input
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="rounded-2xl"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Banner URL</Label>
            <Input
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="rounded-2xl"
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton onClick={handleCreate}>{editingCollectionId ? "Save Changes" : "Create Collection"}</AdminButton>
            <AdminButton variant="ghost" onClick={resetForm}>Cancel</AdminButton>
          </div>
        </AdminCard>
      )}

      {collections?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {collections.map((c) => (
            <AdminCard key={c.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="display text-lg font-semibold">{c.name}</h3>
                  <p className="mt-1 text-sm text-ink/60">{c.description}</p>
                  <p className="mt-2 text-xs text-ink/40">/{c.slug}</p>
                </div>
                <div className="flex gap-2">
                  <AdminButton variant="ghost" onClick={() => handleEdit(c)}>
                    Edit
                  </AdminButton>
                  <AdminButton variant="ghost" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="h-4 w-4" />
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      ) : (
        <AdminEmptyState title="No collections" description="Create editorial collections for your shop." />
      )}
    </div>
  );
}
