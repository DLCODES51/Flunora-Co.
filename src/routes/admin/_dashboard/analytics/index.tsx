"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AdminPageHeader,
  AdminStatCard,
  AdminCard,
  AdminEmptyState,
} from "@/components/admin/AdminPageHeader";
import { useAccessToken, withToken } from "@/hooks/use-admin-api";
import { getProductStats, getProducts, getProductsByCategory } from "@/functions/products";
import { getMessageCount, getNewsletterCount } from "@/functions/content";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  LineChart,
  Line,
} from "recharts";

export const Route = createFileRoute("/admin/_dashboard/analytics/")({
  component: AdminAnalyticsPage,
});

const COLORS = ["#F5B3CB", "#DDF4FF", "#FFE89A", "#D9F4D7", "#FFD7BF"];

function AdminAnalyticsPage() {
  const accessToken = useAccessToken();
  const statsFn = useServerFn(getProductStats);
  const productsFn = useServerFn(getProducts);
  const categoryFn = useServerFn(getProductsByCategory);
  const messagesFn = useServerFn(getMessageCount);
  const newsletterFn = useServerFn(getNewsletterCount);

  const enabled = Boolean(accessToken);

  const { data: stats } = useQuery({
    queryKey: ["analytics-stats"],
    queryFn: () => statsFn({ data: withToken({}, accessToken!) }),
    enabled,
  });

  const { data: products } = useQuery({
    queryKey: ["analytics-products"],
    queryFn: () => productsFn({ data: withToken({}, accessToken!) }),
    enabled,
  });

  const { data: categories } = useQuery({
    queryKey: ["analytics-categories"],
    queryFn: () => categoryFn({ data: withToken({}, accessToken!) }),
    enabled,
  });

  const { data: messages } = useQuery({
    queryKey: ["analytics-messages"],
    queryFn: () => messagesFn({ data: withToken({}, accessToken!) }),
    enabled,
  });

  const { data: subscribers } = useQuery({
    queryKey: ["analytics-newsletter"],
    queryFn: () => newsletterFn({ data: withToken({}, accessToken!) }),
    enabled,
  });

  const categoryChart =
    categories?.map((c) => ({ name: c.category ?? "Other", value: Number(c.count) })) ?? [];

  const trackingTodo =
    "TODO: add an analytics_events table with product_id, event_type, created_at to power real view and click charts.";

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        description="Overview of products, audience, and catalog health. Product view/click tracking will be wired once analytics events are available."
        breadcrumbs={[{ label: "Analytics" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Products" value={stats?.total ?? 0} />
        <AdminStatCard label="Featured Products" value={stats?.featured ?? 0} accent="var(--butter)" />
        <AdminStatCard label="Messages" value={messages?.total ?? 0} accent="var(--sky)" />
        <AdminStatCard label="Subscribers" value={subscribers ?? 0} accent="var(--mint)" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="display mb-4 text-lg font-semibold">Products by Category</h2>
          {categoryChart.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChart}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {categoryChart.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <AdminEmptyState title="No data" description="Add products to see category breakdown." />
          )}
        </AdminCard>

        <AdminCard className="lg:col-span-2">
          <h2 className="display mb-4 text-lg font-semibold">Engagement Tracking</h2>
          <p className="text-sm text-ink/70">
            Product view and click events are not being captured yet, so there are no real engagement charts to display.
          </p>
          <p className="mt-3 rounded-2xl bg-cream p-3 text-sm text-ink/60">{trackingTodo}</p>
        </AdminCard>
      </div>
    </div>
  );
}
