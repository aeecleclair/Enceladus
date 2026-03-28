"use client";
import * as React from "react";
import { Command, LifeBuoy, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { NavUser } from "../../custom/NavUser";
import { useEdition } from "@/src/hooks/useEdition";
import { NavValidation } from "./NavValidation";
import { NavSchools } from "./NavSchools";
import { NavSports } from "./NavSports";
import { NavGroups } from "./NavGroups";
import { NavMatches } from "./NavMatches";
import { NavTeams } from "./NavTeams";
import { NavProducts } from "./NavProducts";
import { NavLocations } from "./NavLocations";
import { NavPodiums } from "./NavPodiums";
import { NavLicense } from "./NavLicense";
import { NavVolunteerShifts } from "./NavVolunteerShifts";
import { NavEditions } from "./NavEditions";
import { useUser } from "@/src/hooks/useUser";
import { Logo } from "../../custom/Logo";
import { NavExport } from "./NavExport";
import { NavSchoolAssign } from "./NavSchoolAssign";
import { Badge } from "../../ui/badge";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { edition } = useEdition();
  const router = useRouter();
  const { isAdmin, isSportManager, isBDS } = useUser();

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
      <SidebarContent className="[&_[data-sidebar=group]]:!py-0.5">
        {isAdmin() && <NavEditions />}
        {edition && (
          <>
            {/* Competition section — sport managers & admin */}
            {(isAdmin() || isSportManager()) && (
              <>
                <SidebarSeparator />
                <SidebarGroup className="!py-0">
                  <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
                    Compétition
                    {isAdmin() && (
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
            {(isAdmin() || isBDS()) && (
              <>
                <SidebarSeparator />
                <SidebarGroup className="!py-0">
                  <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
                    Inscriptions
                    {isAdmin() && (
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
            {isAdmin() && (
              <>
                <SidebarSeparator />
                <SidebarGroup className="!py-0">
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
