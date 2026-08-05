import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AlertCircle, CheckCircle, School, Trophy, Users } from "lucide-react";

export interface SportQuotaUsage {
  sportId: string;
  sportName: string;
  participants: number;
  participantQuota: number | null;
  teams: number;
  teamQuota: number | null;
}

interface GlobalQuotaCardProps {
  totalParticipants: number;
  totalValidated: number;
  totalTeams: number;
  sportQuotaUsage: SportQuotaUsage[];
  schoolName: string;
}

const isQuotaReached = (used: number, quota: number | null) =>
  quota !== null && used >= quota;

export const GlobalQuotaCard = ({
  totalParticipants,
  totalValidated,
  totalTeams,
  sportQuotaUsage,
  schoolName,
}: GlobalQuotaCardProps) => {
  const reachedSports = sportQuotaUsage.filter(
    (sport) =>
      isQuotaReached(sport.participants, sport.participantQuota) ||
      isQuotaReached(sport.teams, sport.teamQuota),
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Aperçu global - {schoolName}
          </CardTitle>
          <div className="flex items-center gap-2">
            {reachedSports.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                {reachedSports.length === 1
                  ? `Quota atteint : ${reachedSports[0].sportName}`
                  : `${reachedSports.length} sports au quota`}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Total participants</span>
            </div>
            <div className="text-2xl font-bold">{totalParticipants}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Total équipes</span>
            </div>
            <div className="text-2xl font-bold">{totalTeams}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Participants validés
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {totalValidated}
            </div>
            <div className="text-xs text-muted-foreground">
              {totalParticipants > 0
                ? Math.round((totalValidated / totalParticipants) * 100)
                : 0}
              % validés
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">En attente</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {totalParticipants - totalValidated}
            </div>
            <div className="text-xs text-muted-foreground">
              Participants non validés
            </div>
          </div>
        </div>

        {sportQuotaUsage.length > 0 && (
          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-2">
              Quotas par sport
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {sportQuotaUsage.map((sport) => {
                const participantsReached = isQuotaReached(
                  sport.participants,
                  sport.participantQuota,
                );
                const teamsReached = isQuotaReached(
                  sport.teams,
                  sport.teamQuota,
                );
                return (
                  <div
                    key={sport.sportId}
                    className="flex items-center justify-between gap-4 rounded-md border px-3 py-2"
                  >
                    <span className="text-sm font-medium truncate">
                      {sport.sportName}
                    </span>
                    <div className="flex items-center gap-3 text-xs whitespace-nowrap">
                      <span
                        className={
                          participantsReached
                            ? "font-bold text-destructive"
                            : "text-muted-foreground"
                        }
                      >
                        {sport.participants} /{" "}
                        {sport.participantQuota ?? "illimité"} participants
                      </span>
                      <span
                        className={
                          teamsReached
                            ? "font-bold text-destructive"
                            : "text-muted-foreground"
                        }
                      >
                        {sport.teams} / {sport.teamQuota ?? "illimité"} équipes
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Progression de validation
            </span>
            <span className="font-medium">
              {totalValidated} / {totalParticipants}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className="bg-primary rounded-full h-3 transition-all"
              style={{
                width: `${totalParticipants > 0 ? (totalValidated / totalParticipants) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
