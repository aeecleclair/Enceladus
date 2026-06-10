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
import { useEdition } from "@/hooks/raid/useEdition";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { Link } from "@/i18n/navigation";
import { NavTeam } from "./NavTeam";
import { NavVolunteer } from "./NavVolunteer";
import { NavProfile } from "./NavProfile";
import { NavInfo } from "./NavInfo";
import { useTranslations } from "next-intl";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { edition } = useEdition();
  const { me } = useMeParticipant();
  const { meVolunteer } = useMeVolunteer();
  const t = useTranslations("raid.home.sidebar");

  const hasRole = !!me || !!meVolunteer;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="w-full">
                <Logo />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Raid</span>
                  {edition ? (
                    <span className="truncate text-xs">
                      {t("editionYear", { year: edition.year })}
                    </span>
                  ) : (
                    <span className="truncate text-xs">
                      {t("noActiveEdition")}
                    </span>
                  )}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="[&_[data-sidebar=group]]:!py-0.5">
        {hasRole && (
          <>
            <SidebarGroup className="!py-0">
              <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
                {t("mySpace")}
              </SidebarGroupLabel>
            </SidebarGroup>
            {me && <NavTeam />}
            {meVolunteer && <NavVolunteer />}
            <NavProfile />
          </>
        )}
        {!hasRole && edition && (
          <>
            <SidebarGroup className="!py-0">
              <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
                {t("myAccount")}
              </SidebarGroupLabel>
            </SidebarGroup>
            <NavProfile />
          </>
        )}
        <SidebarSeparator />
        <SidebarGroup className="!py-0">
          <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
            {t("raidSection")}
          </SidebarGroupLabel>
        </SidebarGroup>
        <NavInfo />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
