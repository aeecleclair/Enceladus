"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

export function NavInfo() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/info");
  const t = useTranslations("raid.home.sidebar");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={t("information")}
        >
          <Link href="/info">
            <Info />
            <span>{t("raidInfo")}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
