import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

export function AdminPageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  className,
}: {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="mb-2 flex flex-wrap items-center gap-1 text-xs text-ink/50">
            <Link to="/admin" className="hover:text-ink">
              Admin
            </Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.label} className="inline-flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-ink">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="display text-3xl font-bold text-ink">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-ink/60">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function AdminStatCard({
  label,
  value,
  hint,
  accent = "var(--pink)",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}) {
  return (
    <div
      className="rounded-3xl bg-white p-5 transition hover:-translate-y-0.5"
      style={{
        border: "1.5px solid #111",
        boxShadow: "4px 4px 0 #111",
        background: `linear-gradient(135deg, ${accent}33 0%, #fff 60%)`,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">{label}</p>
      <p className="display mt-2 text-3xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center"
      style={{ border: "1.5px dashed #111" }}
    >
      <p className="script text-3xl text-pink-deep">So empty…</p>
      <h3 className="display mt-3 text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-ink/60">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-3xl bg-white p-6", className)}
      style={{ border: "1.5px solid #111", boxShadow: "4px 4px 0 rgba(17,17,17,0.08)" }}
    >
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  className,
  variant = "ink",
  ...props
}: React.ComponentProps<"button"> & { variant?: "ink" | "pink" | "ghost" }) {
  const styles =
    variant === "pink"
      ? "bg-pink text-ink"
      : variant === "ghost"
        ? "bg-transparent text-ink hover:bg-pink/20"
        : "bg-ink text-white";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:opacity-50",
        styles,
        className,
      )}
      style={{ border: "1.5px solid #111", boxShadow: "3px 3px 0 #111" }}
      {...props}
    >
      {children}
    </button>
  );
}
