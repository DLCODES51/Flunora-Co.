"use client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Package, Star, EyeOff, AlertTriangle, Layers, Image, Mail, Users, Plus } from "lucide-react";
import {
  AdminPageHeader,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminEmptyState,
} from "@/components/admin/AdminPageHeader";
import { useAccessToken, withToken } from "@/hooks/use-admin-api";
import { getProductStats, getProducts, getProductsByCategory } from "@/functions/products";
import { getCollectionCount } from "@/functions/catalog";
import { getMediaCount, getMessageCount, getNewsletterCount, getActivityLogs } from "@/functions/content";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

export const Route = createFileRoute("/admin/_dashboard/")({
  component: AdminHomePage,
});

const CHART_COLORS = ["#F5B3CB", "#DDF4FF", "#FFE89A", "#D9F4D7", "#FFD7BF"];

function AdminHomePage() {
  const accessToken = useAccessToken();
  const statsFn = useServerFn(getProductStats);
  const productsFn = useServerFn(getProducts);
  const categoryFn = useServerFn(getProductsByCategory);
  const collectionsFn = useServerFn(getCollectionCount);
  const mediaFn = useServerFn(getMediaCount);
  const messagesFn = useServerFn(getMessageCount);
  const newsletterFn = useServerFn(getNewsletterCount);
  const activityFn = useServerFn(getActivityLogs);

  const enabled = Boolean(accessToken);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => statsFn({ data: withToken({}, accessToken!) }),
    enabled,
  });

  const { data: latestProducts } = useQuery({
    queryKey: ["admin-latest-products"],
    queryFn: () => productsFn({ data: withToken({ sort: "newest" }, accessToken!) }),
    enabled,
  });

  const { data: categoryData } = useQuery({
    queryKey: ["admin-category-chart"],
    queryFn: () => categoryFn({ data: withToken({}, accessToken!) }),
    enabled,
  });

  const { data: collections } = useQuery({
    queryKey: ["admin-collections-count"],
    queryFn: () => collectionsFn({ data: withToken({}, accessToken!) }),
    enabled,
  });

  const { data: mediaCount } = useQuery({
    queryKey: ["admin-media-count"],
    queryFn: () => mediaFn({ data: withToken({}, accessToken!) }),
    enabled,
  });

  const { data: messages } = useQuery({
    queryKey: ["admin-messages-count"],
    queryFn: () => messagesFn({ data: withToken({}, accessToken!) }),
    enabled,
  });

  const { data: subscribers } = useQuery({
    queryKey: ["admin-newsletter-count"],
    queryFn: () => newsletterFn({ data: withToken({}, accessToken!) }),
    enabled,
  });

  const { data: activity } = useQuery({
    queryKey: ["admin-activity"],
    queryFn: () => activityFn({ data: withToken({}, accessToken!) }),
    enabled,
  });

  const chartData =
    categoryData?.map((row) => ({
      name: row.category ?? "Uncategorized",
      count: Number(row.count),
    })) ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back to your cozy crochet studio."
        actions={
          <>
            <Link to="/admin/products/new">
              <AdminButton>
                <Plus className="h-4 w-4" /> Add Product
              </AdminButton>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-3xl" />)
        ) : (
          <>
            <AdminStatCard label="Total Products" value={stats?.total ?? 0} accent="var(--pink)" />
            <AdminStatCard label="Featured" value={stats?.featured ?? 0} accent="var(--butter)" />
            <AdminStatCard label="Hidden" value={stats?.hidden ?? 0} accent="var(--sky)" />
            <AdminStatCard label="Out of Stock" value={stats?.outOfStock ?? 0} accent="var(--peach)" />
            <AdminStatCard label="Collections" value={collections ?? 0} accent="var(--mint)" />
            <AdminStatCard label="Images Uploaded" value={mediaCount ?? 0} accent="var(--sky)" />
            <AdminStatCard label="Contact Requests" value={messages?.total ?? 0} hint={`${messages?.unread ?? 0} unread`} accent="var(--pink)" />
            <AdminStatCard label="Newsletter" value={subscribers ?? 0} accent="var(--butter)" />
          </>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <AdminCard className="xl:col-span-2">
          <h2 className="display mb-4 text-lg font-semibold">Category Distribution</h2>
          {chartData.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <AdminEmptyState title="No products yet" description="Add products to see category analytics." />
          )}
        </AdminCard>

        <AdminCard>
          <h2 className="display mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="grid gap-2">
            {[
              { to: "/admin/products/new", label: "Add Product", icon: Package },
              { to: "/admin/collections/", label: "Manage Collections", icon: Layers },
              { to: "/admin/media/", label: "Upload Media", icon: Image },
              { to: "/admin/messages/", label: "View Messages", icon: Mail },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-2xl border border-ink/10 px-4 py-3 text-sm font-medium transition hover:bg-pink/20"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </AdminCard>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="display text-lg font-semibold">Latest Products</h2>
            <Link to="/admin/products/" className="text-xs font-semibold text-ink/50 hover:text-ink">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {latestProducts?.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
                <div>
                  <p className="font-semibold text-ink">{p.name}</p>
                  <p className="text-xs text-ink/50">₹{p.price}</p>
                </div>
                <div className="flex gap-1">
                  {p.featured && <Star className="h-3.5 w-3.5 text-butter fill-butter" />}
                  {!p.visible && <EyeOff className="h-3.5 w-3.5 text-ink/40" />}
                  {p.stockStatus === "out_of_stock" && (
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  )}
                </div>
              </div>
            )) ?? (
              <AdminEmptyState
                title="No products"
                description="Start by adding your first crochet creation."
                action={
                  <Link to="/admin/products/new">
                    <AdminButton>Add Product</AdminButton>
                  </Link>
                }
              />
            )}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="display mb-4 text-lg font-semibold">Recent Activity</h2>
          <div className="space-y-3">
            {activity?.map((log) => (
              <div key={log.id} className="rounded-2xl border border-ink/10 px-4 py-3">
                <p className="text-sm font-medium capitalize text-ink">
                  {log.action.replace(/_/g, " ")} {log.entityType}
                </p>
                <p className="text-xs text-ink/50">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            )) ?? (
              <p className="text-sm text-ink/50">Activity will appear here as you manage content.</p>
            )}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
