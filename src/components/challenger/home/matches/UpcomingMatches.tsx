import { Match, MatchComplete } from "../../../api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { MatchCard } from "./MatchCard";
import { useFavoriteMatches } from "../../../hooks/useFavoriteMatches";

interface UpcomingMatchesProps {
  matches: MatchComplete[];
  userTeamId?: string;
  title?: string;
  showSportBadge?: boolean;
  showSchoolBadges?: boolean;
  showSportCategoryBadges?: boolean;
  showTeamBadges?: boolean;
  sports?: Array<{ id: string; name: string; sport_category?: string | null }>;
  schools?: Array<{ school_id: string; school: { id: string; name: string } }>;
  teams?: Array<{
    id: string;
    name: string;
    school_id: string;
    sport_id: string;
  }>;
}

export const UpcomingMatches = ({
  matches,
  userTeamId,
  title = "Prochains Matchs",
  showSportBadge = false,
  showSchoolBadges = false,
  showSportCategoryBadges = false,
  showTeamBadges = false,
  sports = [],
  schools = [],
  teams = [],
}: UpcomingMatchesProps) => {
  const [showAllMatches, setShowAllMatches] = useState(false);
  const { toggleFavorite, isFavorite } = useFavoriteMatches();

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucun match programmé pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

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

    if (diffMinutes < 0) return undefined;
    if (diffMinutes < 60) return `${diffMinutes}min`;

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(showAllMatches ? matches : matches.slice(0, 3)).map(
          (match, index) => {
            const urgency = match.date ? getMatchUrgency(match.date) : "normal";
            const timeUntil = match.date
              ? getTimeUntilMatch(match.date)
              : "N/A";

            return (
              <div key={match.id}>
                <MatchCard
                  match={match}
                  userTeamId={userTeamId}
                  urgency={urgency}
                  timeUntil={timeUntil}
                  showSportBadge={showSportBadge}
                  showSchoolBadges={showSchoolBadges}
                  showSportCategoryBadges={showSportCategoryBadges}
                  showTeamBadges={showTeamBadges}
                  sports={sports}
                  schools={schools}
                  teams={teams}
                  onFavorite={(e) => {
                    e.stopPropagation();
                    toggleFavorite(match.id);
                  }}
                  isFavorite={isFavorite(match.id)}
                />

                {index <
                  (showAllMatches
                    ? matches.length
                    : Math.min(matches.length, 3)) -
                    1 && <Separator className="mt-4" />}
              </div>
            );
          },
        )}

        {matches.length > 3 && (
          <div className="pt-2">
            <button
              onClick={() => setShowAllMatches(!showAllMatches)}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1 py-2 hover:bg-muted/50 rounded"
            >
              {showAllMatches ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Afficher moins
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  et {matches.length - 3} autres matchs programmés...
                </>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
