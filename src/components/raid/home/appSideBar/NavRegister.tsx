"use client";
import { Link, usePathname } from "@/i18n/navigation";

import { useTranslations } from "next-intl";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { HeartHandshake } from "lucide-react";

export function NavRegisterVolunteer() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/volunteer-register");
  const t = useTranslations("raid.home.sidebar");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={t("registerVolunteer")}
        >
          <Link href="/volunteer-register">
            <HeartHandshake />
            <span>{t("registerVolunteer")}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
