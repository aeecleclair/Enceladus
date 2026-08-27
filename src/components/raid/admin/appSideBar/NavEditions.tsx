"use client";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { CalendarDays } from "lucide-react";

export function NavEditions() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname.startsWith("/admin/editions");
  const t = useTranslations("raid.admin.sidebar");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => router.push("/admin/editions")}
          isActive={isActive}
        >
          <CalendarDays />
          <span>{t("editions")}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
