"use client";
import { Logo } from "../../custom/Logo";
import { NavUser } from "../../custom/NavUser";
import { NavEditions } from "./NavEditions";
import { NavExport } from "./NavExport";
import { NavGroups } from "./NavGroups";
import { NavLicense } from "./NavLicense";
import { NavLocations } from "./NavLocations";
import { NavMatches } from "./NavMatches";
import { NavPodiums } from "./NavPodiums";
import { NavProducts } from "./NavProducts";
import { NavSchoolAssign } from "./NavSchoolAssign";
import { NavSchools } from "./NavSchools";
import { NavSports } from "./NavSports";
import { NavTeams } from "./NavTeams";
import { NavValidation } from "./NavValidation";
import { NavVolunteerShifts } from "./NavVolunteerShifts";

import { useEdition } from "@/hooks/challenger/useEdition";
import { useHasChallengerPermission } from "@/hooks/challenger/useHasChallengerPermission";
import { useRouter } from "@/i18n/navigation";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
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

import { Command, LifeBuoy, Send } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { edition } = useEdition();
  const router = useRouter();
  const { isChallengerAdmin, isSportManager, isBDS } =
    useHasChallengerPermission();

  const handleLogoClick = () => {
    router.push("/admin");
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={handleLogoClick}>
              <Logo />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Challenger</span>
                <span className="truncate text-xs">Administration</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="**:data-[sidebar=group]:py-0.5!">
        {isChallengerAdmin && <NavEditions />}
        {edition && (
          <>
            {/* Competition section — sport managers & admin */}
            {(isChallengerAdmin || isSportManager) && (
              <>
                <SidebarSeparator />
                <SidebarGroup className="py-0!">
                  <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
                    Compétition
                    {isChallengerAdmin && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0.5 font-medium normal-case tracking-normal bg-foreground text-background border-transparent"
                      >
                        VP Tournois
                      </Badge>
                    )}
                  </SidebarGroupLabel>
                </SidebarGroup>
                <NavMatches />
                <NavTeams />
                <NavPodiums />
              </>
            )}

            {/* Validation section — BDS & admin */}
            {(isChallengerAdmin || isBDS) && (
              <>
                <SidebarSeparator />
                <SidebarGroup className="py-0!">
                  <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
                    Inscriptions
                    {isChallengerAdmin && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0.5 font-medium normal-case tracking-normal bg-foreground text-background border-transparent"
                      >
                        BDS
                      </Badge>
                    )}
                  </SidebarGroupLabel>
                </SidebarGroup>
                <NavValidation />
              </>
            )}

            {/* Admin-only section */}
            {isChallengerAdmin && (
              <>
                <SidebarSeparator />
                <SidebarGroup className="py-0!">
                  <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
                    Administration
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0.5 font-medium normal-case tracking-normal bg-foreground text-background border-transparent"
                    >
                      Admin
                    </Badge>
                  </SidebarGroupLabel>
                </SidebarGroup>
                <NavSchools />
                <NavSports />
                <NavLocations />
                <NavGroups />
                <NavProducts />
                <NavLicense />
                <NavVolunteerShifts />
                <NavSchoolAssign />
                <NavExport />
              </>
            )}
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
