import { Match, MatchComplete } from "../../../api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { PastMatchCard } from "./PastMatchCard";
import { useFavoriteMatches } from "../../../hooks/useFavoriteMatches";

interface PastMatchesProps {
  matches: MatchComplete[];
  userTeamId?: string;

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

export const PastMatches = ({
  matches,
  userTeamId,
  showSportBadge = false,
  showSchoolBadges = false,
  showSportCategoryBadges = false,
  showTeamBadges = false,
  sports = [],
  schools = [],
  teams = [],
}: PastMatchesProps) => {
  const [showAllMatches, setShowAllMatches] = useState(false);
  const { toggleFavorite, isFavorite } = useFavoriteMatches();

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Matchs Précédents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucun match joué pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Matchs Précédents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(showAllMatches ? matches : matches.slice(0, 3)).map(
          (match, index) => {
            return (
              <div key={match.id}>
                <PastMatchCard
                  match={match}
                  userTeamId={userTeamId}
                  showSportBadge={showSportBadge}
                  showSchoolBadges={showSchoolBadges}
                  showSportCategoryBadges={showSportCategoryBadges}
                  showTeamBadges={showTeamBadges}
                  sports={sports}
                  schools={schools}
                  teams={teams}
                  onFavorite={(e) => { e.stopPropagation(); toggleFavorite(match.id); }}
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
                  et {matches.length - 3} autres matchs...
                </>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
