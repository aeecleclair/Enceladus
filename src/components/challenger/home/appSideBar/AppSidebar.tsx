"use client";
import * as React from "react";
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
} from "@/components/ui/sidebar";
import { NavUser } from "../../custom/NavUser";
import { useEdition } from "@/hooks/challenger/useEdition";
import { NavMatches } from "./NavMatches";
import { NavVolunteerShifts } from "./NavVolunteerShifts";
import { NavSearch } from "./NavSearch";
import { NavLocations } from "./NavLocations";
import { NavPodium } from "./NavPodium";
import { useParticipant } from "@/hooks/challenger/useParticipant";
import { Logo } from "../../custom/Logo";
import { FlaskConical } from "lucide-react";
import { useMeUser } from "@/hooks/useMeUser";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { edition } = useEdition();
  const router = useRouter();
  const { meParticipant } = useParticipant();
  const { user: me } = useMeUser();
  const isVolunteer = me?.school_id == "d9772da7-1142-4002-8b86-b694b431dfed";

  const isDevMode =
    typeof document !== "undefined" &&
    document.cookie.split("; ").some((c) => c === "dev_during_event=true");

  const handleLogoClick = () => {
    router.push("/");
  };

  const exitDevMode = () => {
    document.cookie =
      "dev_during_event=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <button onClick={handleLogoClick} className="w-full">
                <Logo />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Challenger</span>
                  {edition ? (
                    <span className="truncate text-xs">
                      Edition {edition.year}
                    </span>
                  ) : (
                    <span className="truncate text-xs">
                      Aucune édition active
                    </span>
                  )}
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="[&_[data-sidebar=group]]:!py-0.5">
        {edition && (meParticipant || isVolunteer) && (
          <>
            <SidebarGroup className="!py-0">
              <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
                Mon espace
              </SidebarGroupLabel>
            </SidebarGroup>
            {meParticipant && <NavMatches />}
            {isVolunteer && <NavVolunteerShifts />}
          </>
        )}
        {edition && (
          <>
            <SidebarSeparator />
            <SidebarGroup className="!py-0">
              <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-3 pt-2 pb-1">
                Compétition
              </SidebarGroupLabel>
            </SidebarGroup>
            <NavSearch />
            <NavLocations />
            <NavPodium />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        {isDevMode && (
          <button
            onClick={exitDevMode}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200"
          >
            <FlaskConical className="h-3.5 w-3.5 flex-shrink-0" />
            Quitter le mode prévisualisation
          </button>
        )}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
