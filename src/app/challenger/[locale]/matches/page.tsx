"use client";

import { MatchComplete } from "@/api";
import { AppSidebar } from "@/components/challenger/home/appSideBar/AppSidebar";
import { PastMatches } from "@/components/challenger/home/matches/PastMatches";
import { UpcomingMatches } from "@/components/challenger/home/matches/UpcomingMatches";
import { useParticipant } from "@/hooks/challenger/useParticipant";
import { useSportMatches } from "@/hooks/challenger/useSportMatches";

import { useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Calendar } from "lucide-react";

export default function MatchesPage() {
  const { meParticipant } = useParticipant();

  const { sportMatches } = useSportMatches({
    sportId: meParticipant?.sport_id,
  });

  const userTeamId = meParticipant?.team_id;

  const matchStats = useMemo(() => {
    if (!sportMatches || !userTeamId) {
      return {
        upcomingMatches: [],
        pastMatches: [],
        totalMatches: 0,
        victories: 0,
      };
    }

    const now = new Date();
    const nowTime = now.getTime();

    return sportMatches.reduce(
      (acc, match: MatchComplete) => {
        if (match.team1_id !== userTeamId && match.team2_id !== userTeamId) {
          return acc;
        }

        acc.totalMatches++;

        if (!match.date) {
          return acc;
        }

        const matchTime = new Date(match.date).getTime();

        if (matchTime > nowTime) {
          acc.upcomingMatches.push({ ...match, _matchTime: matchTime });
        } else {
          acc.pastMatches.push({ ...match, _matchTime: matchTime });

          if (match.winner_id === userTeamId) {
            acc.victories++;
          }
        }

        return acc;
      },
      {
        upcomingMatches: [] as (MatchComplete & { _matchTime: number })[],
        pastMatches: [] as (MatchComplete & { _matchTime: number })[],
        totalMatches: 0,
        victories: 0,
      },
    );
  }, [sportMatches, userTeamId]);

  const { upcomingMatches, pastMatches } = matchStats;

  useMemo(() => {
    upcomingMatches.sort((a, b) => a._matchTime - b._matchTime);
    pastMatches.sort((a, b) => b._matchTime - a._matchTime);
  }, [upcomingMatches, pastMatches]);

  if (!meParticipant || !userTeamId) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="flex flex-col relative overflow-auto h-full m-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Mes Matchs
                  </h1>
                  <p className="text-muted-foreground">
                    Suivez tous vos matchs passés et à venir
                  </p>
                </div>
              </div>
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Aucune participation trouvée
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Vous devez être inscrit dans une équipe pour voir vos
                    matchs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-col relative overflow-auto h-full m-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Mes Matchs
                </h1>
                <p className="text-muted-foreground">
                  Suivez tous vos matchs passés et à venir
                </p>
              </div>
            </div>

            {/* Matches Sections */}
            <div>
              <UpcomingMatches
                matches={upcomingMatches}
                userTeamId={userTeamId}
              />
            </div>
            <div>
              <PastMatches matches={pastMatches} userTeamId={userTeamId} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
