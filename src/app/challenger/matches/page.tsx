"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { UpcomingMatches } from "../../components/home/matches/UpcomingMatches";
import { PastMatches } from "../../components/home/matches/PastMatches";
import { useSportMatches } from "../../hooks/useSportMatches";
import { useParticipant } from "../../hooks/useParticipant";
import { useSchoolSportTeams } from "../../hooks/useSchoolSportTeams";
import { useSports } from "../../hooks/useSports";
import { useSchools } from "../../hooks/useSchools";
import { Calendar, Trophy, Users, GraduationCap, Zap } from "lucide-react";
import { Match, MatchComplete } from "../../api/hyperionSchemas";
import { useMemo } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/home/appSideBar/AppSidebar";
import { useSportSchools } from "@/src/hooks/useSportSchools";

export default function MatchesPage() {
  const { meParticipant } = useParticipant();
  const { teams } = useSchoolSportTeams({
    sportId: meParticipant?.sport_id,
    schoolId: meParticipant?.school_id,
  });
  const { sportMatches } = useSportMatches({
    sportId: meParticipant?.sport_id,
  });
  const { sports } = useSports();
  const { sportSchools } = useSportSchools();

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

  const { upcomingMatches, pastMatches, totalMatches, victories } = matchStats;

  const userTeam = teams?.find((team) => team.id === userTeamId);
  const userSport = sports?.find(
    (sport) => sport.id === meParticipant?.sport_id,
  );
  const userSchool = sportSchools?.find(
    (school) => school.school_id === meParticipant?.school_id,
  );

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
