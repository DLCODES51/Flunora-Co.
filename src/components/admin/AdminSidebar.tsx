import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  Image,
  Images,
  Mail,
  Newspaper,
  Settings,
  BarChart3,
  LogOut,
  ExternalLink,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAdminAuth } from "@/hooks/use-admin-api";

const navItems = [
  { to: "/admin/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products/", label: "Products", icon: Package },
  { to: "/admin/collections/", label: "Collections", icon: Layers },
  { to: "/admin/content/", label: "Website Content", icon: FileText },
  { to: "/admin/media/", label: "Media Library", icon: Image },
  { to: "/admin/gallery/", label: "Gallery", icon: Images },
  { to: "/admin/messages/", label: "Messages", icon: Mail },
  { to: "/admin/newsletter/", label: "Newsletter", icon: Newspaper },
  { to: "/admin/analytics/", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings/", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <Sidebar
      className="border-r-2 border-ink/10 bg-cream"
      style={{ borderRight: "1.5px solid #111" }}
    >
      <SidebarHeader className="p-4">
        <Link to="/admin" className="flex flex-col leading-none">
          <span className="script text-2xl text-ink">Flunora</span>
          <span className="display text-sm font-bold text-ink/70">Admin Studio</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="display text-xs uppercase tracking-widest text-ink/50">
            Manage
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild className="rounded-xl hover:bg-pink/30">
                    <Link
                      to={item.to}
                      activeOptions={{ exact: item.exact }}
                      activeProps={{ className: "bg-pink/40 font-semibold" }}
                      className="display text-sm"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="rounded-xl">
              <a href="/" target="_blank" rel="noreferrer" className="text-sm">
                <ExternalLink className="h-4 w-4" />
                <span>View Website</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => {
                await signOut();
                navigate({ to: "/admin/login" });
              }}
              className="rounded-xl text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {user?.email && (
          <p className="truncate px-2 text-xs text-ink/50">{user.email}</p>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
