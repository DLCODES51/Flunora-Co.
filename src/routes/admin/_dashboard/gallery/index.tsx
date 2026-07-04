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
import { getGalleryItems, createGalleryItem, deleteGalleryItem } from "@/functions/catalog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/_dashboard/gallery/")({
  component: AdminGalleryPage,
});

function AdminGalleryPage() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();
  const listFn = useServerFn(getGalleryItems);
  const createFn = useServerFn(createGalleryItem);
  const deleteFn = useServerFn(deleteGalleryItem);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const { data: items } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: () => listFn({ data: withToken({}, accessToken!) }),
    enabled: Boolean(accessToken),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });

  const handleAdd = async () => {
    if (!accessToken || !url) return;
    await createFn({ data: withToken({ item: { url, title, visible: true, displayOrder: 0 } }, accessToken) });
    toast.success("Gallery image added");
    setUrl("");
    setTitle("");
    refresh();
  };

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    await deleteFn({ data: withToken({ id }, accessToken) });
    toast.success("Removed");
    refresh();
  };

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description="Pinterest-style masonry images for the public gallery section."
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <AdminCard className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} className="rounded-2xl" />
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-2xl" />
        </div>
        <AdminButton onClick={handleAdd}>
          <Plus className="h-4 w-4" /> Add Image
        </AdminButton>
      </AdminCard>

      {items?.length ? (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid overflow-hidden rounded-3xl bg-white" style={{ border: "1.5px solid #111" }}>
              <img src={item.url} alt={item.alt ?? item.title ?? ""} className="w-full" />
              <div className="flex items-center justify-between p-3">
                <p className="text-sm font-medium">{item.title ?? "Untitled"}</p>
                <AdminButton variant="ghost" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AdminEmptyState title="Gallery is empty" description="Add images from your media library or paste URLs." />
      )}
    </div>
  );
}
