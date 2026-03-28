"use client";

import { TeamComplete } from "@/src/api/hyperionSchemas";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  AlertTriangle,
  Users,
  Crown,
  Trophy,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Star,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useSports } from "@/src/hooks/useSports";
import { useSchools } from "@/src/hooks/useSchools";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useSportSchools } from "@/src/hooks/useSportSchools";

interface TeamCardProps {
  team: TeamComplete;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TeamCard = ({ team, onEdit, onDelete }: TeamCardProps) => {
  const { sports } = useSports();
  const { sportSchools } = useSportSchools();

  const sport = sports?.find((s) => s.id === team.sport_id);
  const sportName = sport?.name || team.sport_id;
  const schoolName =
    sportSchools?.find((school) => school.school_id === team.school_id)?.school
      .name || "";
  const isIncomplete =
    (team.participants?.length ?? 0) < (sport?.team_size ?? 0);

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group ${isIncomplete ? "border-amber-300 bg-amber-50/50" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 flex items-center gap-2">
            {team.name}
          </CardTitle>
          <div className="flex gap-1">
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 border-blue-200"
            >
              <Trophy className="h-3 w-3 mr-1" />
              {sportName}
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 border-green-200"
            >
              {schoolName ? formatSchoolName(schoolName) : "Non spécifiée"}
            </Badge>
            {isIncomplete && (
              <Badge
                variant="outline"
                className="gap-1 bg-amber-100 text-amber-800 border-amber-300"
              >
                <AlertTriangle className="h-3 w-3" />
                {team.participants?.length ?? 0}/{sport?.team_size ?? "?"} joueurs
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3 flex-grow">
        {/* Team Info */}
        <div className="space-y-4">
          {/* Captain */}
          {team.captain_id && (
            <div className="flex items-center gap-2 text-sm">
              <Crown className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">Capitaine:</span>
              <span className="text-muted-foreground">
                {team.participants?.find((p) => p.user_id === team.captain_id)
                  ?.user?.user?.firstname || ""}{" "}
                {team.participants?.find((p) => p.user_id === team.captain_id)
                  ?.user?.user?.name || ""}
              </span>
            </div>
          )}

          {/* Participants List */}
          {team.participants && team.participants.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" />
                <span>Participants ({team.participants.length})</span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {team.participants.map((participant) => (
                  <div
                    key={participant.user_id}
                    className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded border"
                  >
                    <div className="flex items-center gap-2">
                      {/* Captain indicator */}
                      {participant.user_id === team.captain_id && (
                        <Crown className="h-3 w-3 text-yellow-600" />
                      )}

                      {/* Participant name */}
                      <span className="font-medium">
                        {participant.user?.user?.firstname}{" "}
                        {participant.user?.user?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Substitute indicator */}
                      {participant.substitute && (
                        <Badge
                          variant="outline"
                          className="text-xs h-5 bg-orange-100 text-orange-700 border-orange-200"
                        >
                          Sub
                        </Badge>
                      )}

                      {/* Validation status */}
                      {participant.user?.validated ? (
                        <UserCheck className="h-3 w-3 text-green-600" />
                      ) : (
                        <UserX className="h-3 w-3 text-red-500" />
                      )}

                      {/* License status */}
                      {participant.is_license_valid ? (
                        <Shield className="h-3 w-3 text-green-600" />
                      ) : (
                        <Shield className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Statistics */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Total: {team.participants?.length || 0}</span>
            </div>
            {team.participants && (
              <>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <UserCheck className="h-4 w-4" />
                  <span>
                    Validés:{" "}
                    {team.participants.filter((p) => p.user?.validated).length}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>
                    Remplaçants:{" "}
                    {team.participants.filter((p) => p.substitute).length}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      {(onEdit || onDelete) && (
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="flex-1 hover:bg-blue-50 hover:border-blue-300"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="flex-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default TeamCard;
