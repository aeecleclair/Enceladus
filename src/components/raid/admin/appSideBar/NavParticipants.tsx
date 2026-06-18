"use client";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Users } from "lucide-react";

export function NavParticipants() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname.startsWith("/admin/participants");
  const t = useTranslations("raid.admin.sidebar");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => router.push("/admin/participants")}
          isActive={isActive}
        >
          <Users />
          <span>{t("participants")}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
