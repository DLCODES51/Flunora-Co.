"use client";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAdminAuth } from "@/hooks/use-admin-api";
import { useAccessToken, withToken } from "@/hooks/use-admin-api";
import { useServerFn } from "@tanstack/react-start";
import { globalSearch } from "@/functions/content";
import toast from "react-hot-toast";

export function AdminHeader() {
  const { user, signOut } = useAdminAuth();
  const accessToken = useAccessToken();
  const navigate = useNavigate();
  const searchFn = useServerFn(globalSearch);
  const [query, setQuery] = useState("");

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "AD";

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !accessToken) return;
    try {
      const results = await searchFn({ data: withToken({ query }, accessToken) });
      const total =
        results.products.length +
        results.collections.length +
        results.gallery.length +
        results.media.length +
        results.cms.length;
      toast.success(`Found ${total} results for "${query}"`);
      if (results.products[0]) navigate({ to: "/admin/products/" });
    } catch {
      toast.error("Search failed");
    }
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-cream/95 px-4 backdrop-blur md:px-6"
      style={{ borderBottom: "1.5px solid #111" }}
    >
      <SidebarTrigger className="rounded-full border border-ink/20 md:hidden">
        <Menu className="h-4 w-4" />
      </SidebarTrigger>

      <form onSubmit={handleSearch} className="relative hidden max-w-md flex-1 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, collections, media…"
          className="rounded-full border-ink/20 bg-white pl-10"
        />
      </form>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-ink/10"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 rounded-full px-2">
              <Avatar className="h-8 w-8 border border-ink/20">
                <AvatarFallback className="bg-pink text-xs font-bold text-ink">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">{user?.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl">
            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/admin/settings/" })}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
