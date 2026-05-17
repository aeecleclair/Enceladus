"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";
import { LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export function NavDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === "/admin";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => router.push("/admin")}
          isActive={isActive}
        >
          <LayoutDashboard />
          <span>Tableau de bord</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
