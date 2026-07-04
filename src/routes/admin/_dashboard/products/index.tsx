"use client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Copy, Trash2, Eye, EyeOff, Star } from "lucide-react";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminEmptyState,
} from "@/components/admin/AdminPageHeader";
import { useAccessToken, withToken } from "@/hooks/use-admin-api";
import { getProducts, deleteProduct, duplicateProduct, bulkProductAction } from "@/functions/products";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/_dashboard/products/")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();
  const productsFn = useServerFn(getProducts);
  const deleteFn = useServerFn(deleteProduct);
  const duplicateFn = useServerFn(duplicateProduct);
  const bulkFn = useServerFn(bulkProductAction);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<string[]>([]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products", search, sort],
    queryFn: () =>
      productsFn({
        data: withToken({ search: search || undefined, sort }, accessToken!),
      }),
    enabled: Boolean(accessToken),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-products"] });

  const handleDelete = async (id: string) => {
    if (!accessToken || !confirm("Delete this product?")) return;
    await deleteFn({ data: withToken({ id }, accessToken) });
    toast.success("Product deleted");
    invalidate();
  };

  const handleDuplicate = async (id: string) => {
    if (!accessToken) return;
    await duplicateFn({ data: withToken({ id }, accessToken) });
    toast.success("Product duplicated");
    invalidate();
  };

  const handleBulk = async (action: "delete" | "hide" | "publish" | "feature" | "unfeature") => {
    if (!accessToken || !selected.length) return;
    await bulkFn({
      data: withToken({ payload: { ids: selected, action } }, accessToken),
    });
    toast.success(`Bulk ${action} complete`);
    setSelected([]);
    invalidate();
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage your handmade crochet catalog."
        breadcrumbs={[{ label: "Products" }]}
        actions={
          <Link to="/admin/products/new">
            <AdminButton>
              <Plus className="h-4 w-4" /> Add Product
            </AdminButton>
          </Link>
        }
      />

      <AdminCard className="mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="rounded-full pl-10"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full rounded-full md:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price_asc">Price ↑</SelectItem>
              <SelectItem value="price_desc">Price ↓</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selected.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <AdminButton variant="ghost" onClick={() => handleBulk("publish")}>
              Publish
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => handleBulk("hide")}>
              Hide
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => handleBulk("feature")}>
              Feature
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => handleBulk("delete")}>
              Delete
            </AdminButton>
          </div>
        )}
      </AdminCard>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-3xl" />
          ))}
        </div>
      ) : products?.length ? (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-4 rounded-3xl bg-white p-4 md:flex-row md:items-center"
              style={{ border: "1.5px solid #111", boxShadow: "3px 3px 0 rgba(17,17,17,0.06)" }}
            >
              <Checkbox
                checked={selected.includes(product.id)}
                onCheckedChange={() => toggleSelect(product.id)}
              />
              {product.thumbnailUrl && (
                <img
                  src={product.thumbnailUrl}
                  alt=""
                  className="h-16 w-16 rounded-2xl object-cover"
                  style={{ border: "1.5px solid #111" }}
                />
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to="/admin/products/$productId"
                    params={{ productId: product.id }}
                    className="display font-semibold text-ink hover:underline"
                  >
                    {product.name}
                  </Link>
                  {product.featured && <Star className="h-4 w-4 fill-butter text-butter" />}
                  {!product.visible && <EyeOff className="h-4 w-4 text-ink/40" />}
                  {product.badge && (
                    <Badge variant="secondary" className="rounded-full capitalize">
                      {product.badge.replace(/_/g, " ")}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-ink/50">
                  ₹{product.price} · {product.category?.name ?? "Uncategorized"} ·{" "}
                  {product.stockStatus.replace(/_/g, " ")}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/admin/products/$productId" params={{ productId: product.id }}>
                  <AdminButton variant="ghost">Edit</AdminButton>
                </Link>
                <AdminButton variant="ghost" onClick={() => handleDuplicate(product.id)}>
                  <Copy className="h-4 w-4" />
                </AdminButton>
                <AdminButton variant="ghost" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AdminEmptyState
          title="No products yet"
          description="Add your first crochet product to start selling on Meesho."
          action={
            <Link to="/admin/products/new">
              <AdminButton>
                <Plus className="h-4 w-4" /> Add Product
              </AdminButton>
            </Link>
          }
        />
      )}
    </div>
  );
}
