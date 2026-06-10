"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

export function NavProfile() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/profile");
  const t = useTranslations("raid.home.sidebar");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} tooltip={t("profile")}>
          <Link href="/profile">
            <UserRound />
            <span>{t("profile")}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
