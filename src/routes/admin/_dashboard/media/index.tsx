"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Upload, Trash2, Copy, Search } from "lucide-react";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminEmptyState,
} from "@/components/admin/AdminPageHeader";
import { useAccessToken, withToken } from "@/hooks/use-admin-api";
import { getMedia, createMedia, deleteMedia, uploadToStorage } from "@/functions/content";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/_dashboard/media/")({
  component: AdminMediaPage,
});

function AdminMediaPage() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();
  const listFn = useServerFn(getMedia);
  const createFn = useServerFn(createMedia);
  const deleteFn = useServerFn(deleteMedia);
  const uploadFn = useServerFn(uploadToStorage);
  const fileRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: media } = useQuery({
    queryKey: ["admin-media", search],
    queryFn: () => listFn({ data: withToken({ search: search || undefined }, accessToken!) }),
    enabled: Boolean(accessToken),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-media"] });

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length || !accessToken) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const base64 = await fileToBase64(file);
        const { url } = await uploadFn({
          data: withToken(
            { fileName: file.name, fileData: base64, mimeType: file.type, folder: "media" },
            accessToken,
          ),
        });
        await createFn({
          data: withToken(
            { item: { name: file.name, url, mimeType: file.type, size: file.size, folder: "media" } },
            accessToken,
          ),
        });
      }
      toast.success("Upload complete");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!accessToken || !confirm("Delete media?")) return;
    await deleteFn({ data: withToken({ id }, accessToken) });
    toast.success("Deleted");
    refresh();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Upload and manage images for products, collections, and CMS."
        breadcrumbs={[{ label: "Media" }]}
        actions={
          <>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <AdminButton onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload"}
            </AdminButton>
          </>
        }
      />

      <AdminCard className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media…"
            className="rounded-full pl-10"
          />
        </div>
      </AdminCard>

      {media?.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl bg-white"
              style={{ border: "1.5px solid #111", boxShadow: "3px 3px 0 rgba(17,17,17,0.06)" }}
            >
              <div className="aspect-square bg-cream">
                <img src={item.url} alt={item.alt ?? item.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <div className="mt-2 flex gap-1">
                  <AdminButton variant="ghost" onClick={() => copyUrl(item.url)}>
                    <Copy className="h-3.5 w-3.5" />
                  </AdminButton>
                  <AdminButton variant="ghost" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AdminEmptyState
          title="No media yet"
          description="Drag and drop PNG, JPEG, WEBP, or SVG files to get started."
          action={
            <AdminButton onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Upload Files
            </AdminButton>
          }
        />
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
