"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { HeartHandshake } from "lucide-react";

export function NavRegisterVolunteer() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/volunteer-register");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip="Inscription bénévole"
        >
          <Link href="/volunteer-register">
            <HeartHandshake />
            <span>Inscription bénévole</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
