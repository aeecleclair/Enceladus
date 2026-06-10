"use client";

import { Match } from "@/api";
import { AppSidebar } from "@/components/challenger/home/appSideBar/AppSidebar";
import { LocationsMap } from "@/components/challenger/home/locations/LocationsMap";
import { useAllMatches } from "@/hooks/challenger/useAllMatches";
import { useLocations } from "@/hooks/challenger/useLocations";
import { useSports } from "@/hooks/challenger/useSports";

import { useMemo } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function LocationsPage() {
  const { locations } = useLocations();
  const { allMatches } = useAllMatches();
  const { sports } = useSports();

  const locationsWithMatches = useMemo(() => {
    if (!locations || !allMatches) return [];

    const now = new Date();

    return locations.map((location) => {
      const locationMatches = allMatches.filter(
        (match: Match) => match.location_id === location.id,
      );

      const upcomingMatches = locationMatches
        .filter((match: Match) => !match.ended)
        .sort((a: Match, b: Match) => {
          const dateA = new Date(a.date!).getTime();
          const dateB = new Date(b.date!).getTime();
          return dateA - dateB;
        });

      const nextMatch = upcomingMatches[0];
      const totalMatches = upcomingMatches.length;

      return {
        ...location,
        nextMatch,
        totalMatches,
        upcomingMatches,
      };
    });
  }, [locations, allMatches]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <div className="flex flex-col h-[calc(100vh-4rem)] px-6 pb-6">
          <div className="py-4 shrink-0">
            <h1 className="text-3xl font-bold tracking-tight">
              Lieux de Compétition
            </h1>
            <p className="text-muted-foreground">
              Découvrez tous les lieux où se déroulent les matchs avec accès
              direct aux cartes
            </p>
          </div>
          <LocationsMap
            locations={locations || []}
            locationsWithMatches={locationsWithMatches}
            sports={sports}
            className="flex-1 w-full"
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
