"use client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import toast from "react-hot-toast";
import { AdminPageHeader, AdminCard } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAccessToken, withToken } from "@/hooks/use-admin-api";
import { createProduct } from "@/functions/products";
import { getCategories } from "@/functions/catalog";

export const Route = createFileRoute("/admin/_dashboard/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  const accessToken = useAccessToken();
  const navigate = useNavigate();
  const createFn = useServerFn(createProduct);
  const categoriesFn = useServerFn(getCategories);
  const [loading, setLoading] = useState(false);

  // const { data: categories = [] } = useQuery({
  //   queryKey: ["admin-categories"],
  //   queryFn: () => categoriesFn({ data: withToken({}, accessToken!) }),
  //   enabled: Boolean(accessToken),
  // });
  const {
  data: categories = [],
  error,
  isLoading,
  isError,
} = useQuery({
  queryKey: ["admin-categories"],
  queryFn: () => categoriesFn({ data: withToken({}, accessToken!) }),
  enabled: Boolean(accessToken),
});

console.log("Categories:", categories);
console.log("Loading:", isLoading);
console.log("Is Error:", isError);
console.log("Error:", error);

  const onSubmit = async (product: Parameters<typeof createFn>[0]["data"]["product"]) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const created = await createFn({ data: withToken({ product }, accessToken) });
      toast.success("Product created!");
      navigate({ to: "/admin/products/$productId", params: { productId: created.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Add Product"
        breadcrumbs={[{ label: "Products", href: "/admin/products" }, { label: "New" }]}
      />
      <AdminCard>
        <ProductForm categories={categories} onSubmit={onSubmit} loading={loading} />
      </AdminCard>
    </div>
  );
}
