"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMeTeam } from "@/hooks/raid/useMeTeam";
import { Link, usePathname } from "@/i18n/navigation";
import { Users } from "lucide-react";

export function NavTeam() {
  const pathname = usePathname();
  const isActive = pathname === "/team" || pathname.startsWith("/team/");
  const { team } = useMeTeam();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} tooltip="Mon équipe">
          <Link href="/team">
            <Users />
            <span>Mon équipe</span>
            {team?.validation_progress !== undefined && (
              <span className="ml-auto text-[10px] font-medium text-muted-foreground">
                {team.validation_progress.toFixed(0)}%
              </span>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
