import { UserStatusBadges } from "./UserStatusBadges";
import { MatchCard } from "./matches/MatchCard";
import { useParticipant } from "../../hooks/useParticipant";
import { useSportMatches } from "../../hooks/useSportMatches";
import { useSchoolSportTeams } from "../../hooks/useSchoolSportTeams";
import { useSports } from "../../hooks/useSports";
import { useSchools } from "../../hooks/useSchools";
import { useUser } from "../../hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Clock,
  Calendar,
  Trophy,
  Users,
  GraduationCap,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Match, MatchComplete } from "../../api/hyperionSchemas";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

interface FullyRegisteredDashboardProps {
  edition: {
    year: number;
    name: string;
    start_date: string;
    end_date: string;
    active?: boolean;
    inscription_enabled?: boolean;
  };
  meCompetition: {
    is_athlete?: boolean;
    is_pompom?: boolean;
    is_fanfare?: boolean;
    is_cameraman?: boolean;
  };
}

export const FullyRegisteredDashboard = ({
  edition,
  meCompetition,
}: FullyRegisteredDashboardProps) => {
  const { meParticipant } = useParticipant();
  const { me: user } = useUser();
  const router = useRouter();

  const { sportMatches } = useSportMatches({
    sportId: meParticipant?.sport_id,
  });

  const { teams } = useSchoolSportTeams({
    sportId: meParticipant?.sport_id,
    schoolId: meParticipant?.school_id,
  });

  const { sports } = useSports();
  const { sportSchools } = useSportSchools();

  const userTeamId = meParticipant?.team_id;

  const userTeam = teams?.find((team) => team.id === userTeamId);
  const userSport = sports?.find(
    (sport) => sport.id === meParticipant?.sport_id,
  );
  const userSchool = sportSchools?.find(
    (school) => school.school_id === meParticipant?.school_id,
  );

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

  const nextMatch = upcomingMatches.sort(
    (a, b) => a._matchTime - b._matchTime,
  )[0];

  const getMatchUrgency = (matchDate: string) => {
    const now = new Date();
    const match = new Date(matchDate);
    const diffMinutes = (match.getTime() - now.getTime()) / (1000 * 60);

    if (diffMinutes <= 15) return "urgent";
    if (diffMinutes <= 60) return "soon";
    return "normal";
  };

  const getTimeUntilMatch = (matchDate: string) => {
    const now = new Date();
    const match = new Date(matchDate);
    const diffMinutes = Math.round(
      (match.getTime() - now.getTime()) / (1000 * 60),
    );

    if (diffMinutes < 0) return "Passé";
    if (diffMinutes < 60) return `${diffMinutes}min`;

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h${minutes.toString().padStart(2, "0")}`;
  };

  const isParticipant = meCompetition.is_athlete;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">
          Édition {edition.year} - {edition.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Du {new Date(edition.start_date).toLocaleDateString("fr-FR")} au{" "}
          {new Date(edition.end_date).toLocaleDateString("fr-FR")}
        </p>
      </div>

      <UserStatusBadges meCompetition={meCompetition} />

      {/* Team Information Card */}
      {isParticipant && userTeam && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Mon Équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Équipe
                  </p>
                  <p className="font-semibold">{userTeam.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Sport
                  </p>
                  <p className="font-semibold">
                    {userSport?.name || meParticipant?.sport_id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    École
                  </p>
                  <p className="font-semibold">
                    {formatSchoolName(userSchool?.school.name) ||
                      meParticipant?.school_id}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      {isParticipant && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Matchs
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMatches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">À venir</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {upcomingMatches.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Joués</CardTitle>
              <Trophy className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {pastMatches.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Victoires</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {victories}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Next Match */}
      {isParticipant && nextMatch && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Prochain Match
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/matches")}
            >
              Voir tous les matchs
            </Button>
          </CardHeader>
          <CardContent>
            <MatchCard
              match={nextMatch}
              userTeamId={userTeamId}
              urgency={
                nextMatch.date ? getMatchUrgency(nextMatch.date) : "normal"
              }
              timeUntil={
                nextMatch.date ? getTimeUntilMatch(nextMatch.date) : "N/A"
              }
            />
          </CardContent>
        </Card>
      )}

      {/* No Match Message */}
      {isParticipant && !nextMatch && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Prochain Match
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Aucun match programmé
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Aucun match n&apos;est programmé pour le moment.
            </p>
            <Button variant="outline" onClick={() => router.push("/matches")}>
              Voir l&apos;historique
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
