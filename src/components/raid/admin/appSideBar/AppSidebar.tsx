"use client";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/raid/custom/Logo";
import { NavUser } from "@/components/raid/custom/NavUser";
import { useRouter } from "@/i18n/navigation";
import { useEdition } from "@/hooks/raid/useEdition";
import { NavDashboard } from "./NavDashboard";
import { NavParticipants } from "./NavParticipants";
import { NavTeams } from "./NavTeams";
import { NavVolunteers } from "./NavVolunteers";
import { NavEditions } from "./NavEditions";
import { NavInformation } from "./NavInformation";
import { useTranslations } from "next-intl";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { edition } = useEdition();
  const router = useRouter();
  const t = useTranslations("raid.admin.sidebar");

  return (
    <Sidebar variant="inset" className="border-r border-border/70" {...props}>
      <SidebarHeader className="border-b border-border/60 bg-muted/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <button onClick={() => router.push("/admin")} className="w-full">
                <Logo />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Raid</span>
                  <span className="truncate text-xs">
                    {edition
                      ? `Édition ${edition.year} — Administration`
                      : "Administration"}
                  </span>
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar/95 [&_[data-sidebar=group]]:!py-0.5">
        <SidebarGroup className="!py-0">
          <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
            {t("overview")}
          </SidebarGroupLabel>
        </SidebarGroup>
        <NavDashboard />
        <SidebarSeparator />
        <SidebarGroup className="!py-0">
          <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
            {t("registration")}
          </SidebarGroupLabel>
        </SidebarGroup>
        <NavParticipants />
        <NavTeams />
        <NavVolunteers />
        <SidebarSeparator />
        <SidebarGroup className="!py-0">
          <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
            {t("configuration")}
          </SidebarGroupLabel>
        </SidebarGroup>
        <NavEditions />
        <NavInformation />
      </SidebarContent>
      <SidebarFooter className="border-t border-border/60 bg-muted/20">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
