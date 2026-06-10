"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMeTeam } from "@/hooks/raid/useMeTeam";
import { Link, usePathname } from "@/i18n/navigation";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

export function NavTeam() {
  const pathname = usePathname();
  const isActive = pathname === "/team" || pathname.startsWith("/team/");
  const { team } = useMeTeam();
  const t = useTranslations("raid.home.sidebar");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} tooltip={t("team")}>
          <Link href="/team">
            <Users />
            <span>{t("team")}</span>
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
