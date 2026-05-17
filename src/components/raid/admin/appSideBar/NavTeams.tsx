"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";
import { UsersRound } from "lucide-react";
import { usePathname } from "next/navigation";

export function NavTeams() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname.startsWith("/admin/teams");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => router.push("/admin/teams")}
          isActive={isActive}
        >
          <UsersRound />
          <span>Équipes</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
