"use client";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Settings2 } from "lucide-react";

export function NavInformation() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname.startsWith("/admin/information");
  const t = useTranslations("raid.admin.sidebar");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => router.push("/admin/information")}
          isActive={isActive}
        >
          <Settings2 />
          <span>{t("information")}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
