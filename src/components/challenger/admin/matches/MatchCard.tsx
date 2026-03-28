"use client";

import {
  CompetitionUser,
  MatchComplete,
} from "@/src/api/hyperionSchemas";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  CalendarIcon,
  MapPinIcon,
  Trophy,
  Flag,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocations } from "@/src/hooks/useLocations";
import { useSports } from "@/src/hooks/useSports";
import { TeamScoreDisplay } from "./TeamScoreDisplay";
import { useSportSchools } from "@/src/hooks/useSportSchools";

interface MatchCardProps {
  match: MatchComplete;
  onEdit?: () => void;
  onDelete?: () => void;
  competitionUsers?: CompetitionUser[];
}

const MatchCard = ({
  match,
  onEdit,
  onDelete,
  competitionUsers,
}: MatchCardProps) => {
  const { locations } = useLocations();
  const { sports } = useSports();
  const { sportSchools } = useSportSchools();

  const locationName =
    locations?.find((loc) => loc.id === match.location_id)?.name ||
    match.location_id;
  const sportName =
    sports?.find((sport) => sport.id === match.sport_id)?.name ||
    match.sport_id;

  const team1School =
    sportSchools?.find((school) => school.school_id === match.team1?.school_id)
      ?.school.name || "";
  const team2School =
    sportSchools?.find((school) => school.school_id === match.team2?.school_id)
      ?.school.name || "";
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {match.name}
          </CardTitle>
          <div className="flex gap-1">
            {match.ended ? (
              <Badge
                variant="outline"
                className="bg-emerald-100 text-emerald-800 border-emerald-200"
              >
                <Trophy className="h-3 w-3 mr-1" />
                Terminé
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 border-blue-200"
              >
                <Clock className="h-3 w-3 mr-1" />
                Programmé
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3 flex-grow">
        {/* Score Display */}
        <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
          <TeamScoreDisplay
            teamName={match.team1?.name || "Équipe 1"}
            schoolName={team1School}
            score={match.score_team1}
            isWinner={match.winner_id === match.team1_id}
            captain={competitionUsers?.find(
              (user) => user.user_id === match.team1?.captain_id,
            )}
          />

          <div className="col-span-1 flex items-center justify-center">
            <Badge variant="outline" className="bg-white font-semibold">
              VS
            </Badge>
          </div>

          <TeamScoreDisplay
            teamName={match.team2?.name || "Équipe 2"}
            schoolName={team2School}
            score={match.score_team2}
            isWinner={match.winner_id === match.team2_id}
            captain={competitionUsers?.find(
              (user) => user.user_id === match.team2?.captain_id,
            )}
          />
        </div>

        {/* Match Details */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="secondary" className="text-xs font-normal gap-1">
            <Flag className="h-3 w-3" />
            {sportName}
          </Badge>
          {match.date && (
            <Badge variant="secondary" className="text-xs font-normal gap-1">
              <CalendarIcon className="h-3 w-3" />
              {format(new Date(match.date), "dd/MM 'à' HH:mm", {
                locale: fr,
              })}
            </Badge>
          )}
          {match.location_id && (
            <Badge
              variant="secondary"
              className="text-xs font-normal gap-1 max-w-full"
            >
              <MapPinIcon className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{locationName}</span>
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex justify-between items-center w-full">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
