"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { UserRound } from "lucide-react";

export function NavProfile() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/profile");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} tooltip="Profil">
          <Link href="/profile">
            <UserRound />
            <span>Profil</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
