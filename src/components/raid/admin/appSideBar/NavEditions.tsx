"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";
import { CalendarDays } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

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
