"use client";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { HeartHandshake } from "lucide-react";

export function NavVolunteers() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname.startsWith("/admin/volunteers");
  const t = useTranslations("raid.admin.sidebar");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => router.push("/admin/volunteers")}
          isActive={isActive}
        >
          <HeartHandshake />
          <span>{t("volunteers")}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
