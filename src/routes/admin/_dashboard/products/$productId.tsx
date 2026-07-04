"use client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import toast from "react-hot-toast";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAccessToken, withToken } from "@/hooks/use-admin-api";
import { getProduct, updateProduct, deleteProduct } from "@/functions/products";
import { getCategories } from "@/functions/catalog";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/_dashboard/products/$productId")({
  component: EditProductPage,
});

function EditProductPage() {
  const { productId } = Route.useParams();
  const accessToken = useAccessToken();
  const navigate = useNavigate();
  const getFn = useServerFn(getProduct);
  const updateFn = useServerFn(updateProduct);
  const deleteFn = useServerFn(deleteProduct);
  const categoriesFn = useServerFn(getCategories);
  const [loading, setLoading] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["admin-product", productId],
    queryFn: () => getFn({ data: withToken({ id: productId }, accessToken!) }),
    enabled: Boolean(accessToken),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => categoriesFn({ data: withToken({}, accessToken!) }),
    enabled: Boolean(accessToken),
  });

  const onSubmit = async (values: Record<string, unknown>) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      await updateFn({ data: withToken({ id: productId, product: values }, accessToken) });
      toast.success("Product updated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !confirm("Delete this product permanently?")) return;
    await deleteFn({ data: withToken({ id: productId }, accessToken) });
    toast.success("Product deleted");
    navigate({ to: "/admin/products" });
  };

  if (isLoading) return <Skeleton className="h-96 rounded-3xl" />;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <AdminPageHeader
        title={product.name}
        breadcrumbs={[
          { label: "Products", href: "/admin/products" },
          { label: product.name },
        ]}
        actions={
          <AdminButton variant="ghost" onClick={handleDelete}>
            Delete
          </AdminButton>
        }
      />
      <AdminCard>
        <ProductForm
          categories={categories}
          defaultValues={product}
          onSubmit={onSubmit}
          loading={loading}
        />
      </AdminCard>
    </div>
  );
}
