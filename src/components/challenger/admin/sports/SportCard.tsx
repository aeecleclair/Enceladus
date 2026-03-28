"use client";

import { Sport } from "@/src/api/hyperionSchemas";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { sportCategories } from "@/src/forms/sport";
import {
  AlertTriangle,
  Eye,
  Swords,
  Users,
  UserPlus,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SportCardProps {
  sport: Sport;
  matchCount?: number;
  teamCount?: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SportCard = ({
  sport,
  matchCount,
  teamCount,
  onClick,
  onEdit,
  onDelete,
}: SportCardProps) => {
  const hasNoMatches = matchCount !== undefined && matchCount === 0;
  const hasNoTeams = teamCount !== undefined && teamCount === 0;
  const hasWarning = hasNoMatches || hasNoTeams;
  const router = useRouter();
  const categoryLabel =
    sportCategories.find((cat) => cat.value === sport.sport_category)?.label ||
    sport.sport_category;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "masculine":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "feminine":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group ${hasWarning ? "border-amber-300 bg-amber-50/50" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-muted-foreground" />
          {sport.name}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            variant="outline"
            className={`gap-1 ${getCategoryColor(sport.sport_category || "")}`}
          >
            <Users className="h-3 w-3" />
            {categoryLabel || "Mixte"}
          </Badge>
          <Badge
            variant={sport.active ? "default" : "destructive"}
            className="gap-1"
          >
            {sport.active ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {sport.active ? "Actif" : "Inactif"}
          </Badge>
          {hasNoTeams && (
            <Badge
              variant="outline"
              className="gap-1 bg-amber-100 text-amber-800 border-amber-300"
            >
              <AlertTriangle className="h-3 w-3" />
              Aucune équipe
            </Badge>
          )}
          {hasNoMatches && (
            <Badge
              variant="outline"
              className="gap-1 bg-amber-100 text-amber-800 border-amber-300"
            >
              <AlertTriangle className="h-3 w-3" />
              Aucun match
            </Badge>
          )}
          {teamCount !== undefined && teamCount > 0 && (
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {teamCount} équipe{teamCount > 1 ? "s" : ""}
            </Badge>
          )}
          {matchCount !== undefined && matchCount > 0 && (
            <Badge variant="outline" className="gap-1">
              <Swords className="h-3 w-3" />
              {matchCount} match{matchCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{sport.team_size} titulaires</span>
          </div>
          {sport.substitute_max !== undefined &&
            sport.substitute_max !== null && (
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>{sport.substitute_max} remplaçants max</span>
              </div>
            )}
          <Link
            href={`/admin/sports?sport_id=${sport.id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Eye className="h-4 w-4" />
            Voir les détails
          </Link>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) {
                onEdit();
              }
            }}
          >
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) {
                onDelete();
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SportCard;
