"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { Link, usePathname } from "@/i18n/navigation";
import { HeartHandshake } from "lucide-react";

export function NavVolunteer() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/volunteer");
  const { meVolunteer } = useMeVolunteer();

  const statusLabel = meVolunteer?.cancelled
    ? "Annulé"
    : meVolunteer?.validated
      ? "Validé"
      : "En attente";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip="Mon bénévolat"
        >
          <Link href="/volunteer">
            <HeartHandshake />
            <span>Mon bénévolat</span>
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
