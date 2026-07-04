"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, slugify } from "@/lib/validators/admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminButton } from "@/components/admin/AdminPageHeader";
import type { Category } from "@/db/schema";
import type { z } from "zod";

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm({
  defaultValues,
  categories,
  onSubmit,
  loading,
}: {
  defaultValues?: Partial<ProductFormValues>;
  categories: Category[];
  onSubmit: (values: ProductFormValues) => Promise<void>;
  loading?: boolean;
}) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      price: 0,
      categoryId: null,
      tags: [],
      displayOrder: 0,
      featured: false,
      visible: true,
      archived: false,
      stockStatus: "in_stock",
      meeshoUrl: "",
      badge: null,
      seoTitle: "",
      seoDescription: "",
      metaKeywords: [],
      thumbnailUrl: "",
      ...defaultValues,
    },
  });

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (!form.getValues("slug")) {
      form.setValue("slug", slugify(name));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Product Name</Label>
          <Input
            className="rounded-2xl"
            {...form.register("name")}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input className="rounded-2xl" {...form.register("slug")} />
        </div>
        <div className="space-y-2">
          <Label>Price (₹)</Label>
          <Input type="number" className="rounded-2xl" {...form.register("price", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={form.watch("categoryId") ?? "none"}
            onValueChange={(v) => form.setValue("categoryId", v === "none" ? null : v)}
          >
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Short Description</Label>
        <Input className="rounded-2xl" {...form.register("shortDescription")} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea className="min-h-28 rounded-2xl" {...form.register("description")} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Meesho URL</Label>
          <Input className="rounded-2xl" {...form.register("meeshoUrl")} />
        </div>
        <div className="space-y-2">
          <Label>Thumbnail URL</Label>
          <Input className="rounded-2xl" {...form.register("thumbnailUrl")} />
        </div>
        <div className="space-y-2">
          <Label>Stock Status</Label>
          <Select
            value={form.watch("stockStatus")}
            onValueChange={(v) => form.setValue("stockStatus", v as ProductFormValues["stockStatus"])}
          >
            <SelectTrigger className="rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Badge</Label>
          <Select
            value={form.watch("badge") ?? "none"}
            onValueChange={(v) =>
              form.setValue("badge", v === "none" ? null : (v as ProductFormValues["badge"]))
            }
          >
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder="No badge" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="bestseller">Bestseller</SelectItem>
              <SelectItem value="limited_edition">Limited Edition</SelectItem>
              <SelectItem value="coming_soon">Coming Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex items-center gap-3 rounded-2xl border border-ink/10 p-4">
          <Switch checked={form.watch("featured")} onCheckedChange={(v) => form.setValue("featured", v)} />
          <span className="text-sm font-medium">Featured</span>
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-ink/10 p-4">
          <Switch checked={form.watch("visible")} onCheckedChange={(v) => form.setValue("visible", v)} />
          <span className="text-sm font-medium">Visible</span>
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-ink/10 p-4">
          <Switch checked={form.watch("archived")} onCheckedChange={(v) => form.setValue("archived", v)} />
          <span className="text-sm font-medium">Archived</span>
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>SEO Title</Label>
          <Input className="rounded-2xl" {...form.register("seoTitle")} />
        </div>
        <div className="space-y-2">
          <Label>Display Order</Label>
          <Input type="number" className="rounded-2xl" {...form.register("displayOrder", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>SEO Description</Label>
          <Textarea className="rounded-2xl" {...form.register("seoDescription")} />
        </div>
      </div>

      <AdminButton type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save Product"}
      </AdminButton>
    </form>
  );
}
