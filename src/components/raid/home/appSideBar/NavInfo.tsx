"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { Info } from "lucide-react";

export function NavInfo() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/info");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} tooltip="Informations">
          <Link href="/info">
            <Info />
            <span>Infos du Raid</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
