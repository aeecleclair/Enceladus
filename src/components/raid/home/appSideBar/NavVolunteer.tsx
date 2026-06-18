"use client";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { Link, usePathname } from "@/i18n/navigation";

import { useTranslations } from "next-intl";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { HeartHandshake } from "lucide-react";

export function NavVolunteer() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/volunteer");
  const { meVolunteer } = useMeVolunteer();
  const t = useTranslations("raid.home.sidebar");
  const tv = useTranslations("raid.volunteer.dashboard");

  const statusLabel = meVolunteer?.cancelled
    ? tv("cancelled")
    : meVolunteer?.validated
      ? tv("validated")
      : tv("pending");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={t("volunteerStatus")}
        >
          <Link href="/volunteer">
            <HeartHandshake />
            <span>{t("volunteerStatus")}</span>
            {meVolunteer && (
              <span className="ml-auto text-[10px] font-medium text-muted-foreground">
                {statusLabel}
              </span>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
