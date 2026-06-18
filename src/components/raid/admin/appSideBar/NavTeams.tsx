"use client";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { UsersRound } from "lucide-react";

export function NavTeams() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname.startsWith("/admin/teams");
  const t = useTranslations("raid.admin.sidebar");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => router.push("/admin/teams")}
          isActive={isActive}
        >
          <UsersRound />
          <span>{t("teams")}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
