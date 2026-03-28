import { Match, MatchComplete } from "../../../api/hyperionSchemas";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  Trophy,
  School,
  Target,
  ExternalLink,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

interface MatchCardProps {
  match: MatchComplete;
  userTeamId?: string;
  urgency: "urgent" | "soon" | "normal";
  timeUntil?: string;
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
  onFavorite?: (e: React.MouseEvent) => void;
  isFavorite?: boolean;
}

export const MatchCard = ({
  match,
  userTeamId,
  urgency,
  timeUntil,
  showSportBadge = false,
  showSchoolBadges = false,
  showSportCategoryBadges = false,
  showTeamBadges = false,
  sports = [],
  schools = [],
  teams = [],
  onFavorite,
  isFavorite = false,
}: MatchCardProps) => {
  // Helper functions to get sport, school, and team names
  const getSportName = (sportId: string) => {
    return sports.find((sport) => sport.id === sportId)?.name || "Sport";
  };

  const getSportCategory = (sportId: string) => {
    const sport = sports.find((sport) => sport.id === sportId);
    if (!sport?.sport_category) return "Mixte";
    return sport.sport_category === "masculine"
      ? "Masculin"
      : sport.sport_category === "feminine"
        ? "Féminin"
        : "Mixte";
  };

  const getSchoolName = (schoolId: string) => {
    return (
      formatSchoolName(
        schools.find((school) => school.school_id === schoolId)?.school.name,
      ) || "École"
    );
  };

  const getTeamName = (teamId: string) => {
    return teams.find((team) => team.id === teamId)?.name || "Équipe";
  };

  // Helper function to open map application
  const openMap = (location: { name: string; address?: string | null }) => {
    const query = location.address
      ? `${location.name}, ${location.address}`
      : location.name;

    // Try to open in Google Maps (works on most devices)
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    // For mobile devices, try to open native map apps first
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (isMobile) {
      // iOS: Try Apple Maps first, fallback to Google Maps
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const appleMapsUrl = `maps://maps.apple.com/?q=${encodeURIComponent(query)}`;
        window.open(appleMapsUrl, "_system");
        // Fallback after a short delay if Apple Maps doesn't open
        setTimeout(() => {
          window.open(googleMapsUrl, "_blank");
        }, 500);
      } else {
        // Android: Try Google Maps app first
        const androidMapsUrl = `geo:0,0?q=${encodeURIComponent(query)}`;
        window.open(androidMapsUrl, "_system");
        // Fallback after a short delay
        setTimeout(() => {
          window.open(googleMapsUrl, "_blank");
        }, 500);
      }
    } else {
      // Desktop: Open Google Maps in new tab
      window.open(googleMapsUrl, "_blank");
    }
  };
  return (
    <div className="flex gap-4 items-stretch">
      <div className="flex flex-col">
        <Separator
          orientation="vertical"
          className={cn(
            "w-1 flex-1 rounded-full",
            urgency === "urgent" && "bg-red-500",
            urgency === "soon" && "bg-orange-500",
            urgency === "normal" && "bg-blue-500",
          )}
        />
      </div>
      <div className="flex-1 space-y-3 py-1">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-medium text-sm">{match.name}</h4>

            {/* Enhanced Badge Display - Moved up right after match name */}
            {(showSportBadge ||
              showSchoolBadges ||
              showSportCategoryBadges ||
              showTeamBadges) && (
              <div className="flex items-center gap-1 flex-wrap mb-2">
                {showSportBadge && (
                  <Badge
                    variant="outline"
                    className="text-xs flex items-center gap-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    <Trophy className="h-3 w-3" />
                    {getSportName(match.sport_id)}
                  </Badge>
                )}
                {showSportCategoryBadges && (
                  <Badge
                    variant="outline"
                    className="text-xs flex items-center gap-1 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                  >
                    <Target className="h-3 w-3" />
                    {getSportCategory(match.sport_id)}
                  </Badge>
                )}
                {showSchoolBadges && (
                  <>
                    <Badge
                      variant="secondary"
                      className="text-xs flex items-center gap-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      <School className="h-3 w-3" />
                      {getSchoolName(match.team1.school_id)}
                    </Badge>
                    {match.team1.school_id !== match.team2.school_id && (
                      <Badge
                        variant="secondary"
                        className="text-xs flex items-center gap-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      >
                        <School className="h-3 w-3" />
                        {getSchoolName(match.team2.school_id)}
                      </Badge>
                    )}
                  </>
                )}
                {showTeamBadges && (
                  <>
                    <Badge
                      variant="default"
                      className="text-xs flex items-center gap-1 bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                    >
                      <Users className="h-3 w-3" />
                      {getTeamName(match.team1_id)}
                    </Badge>
                    <Badge
                      variant="default"
                      className="text-xs flex items-center gap-1 bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                    >
                      <Users className="h-3 w-3" />
                      {getTeamName(match.team2_id)}
                    </Badge>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {match.date && (
                <span>
                  {new Date(match.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              <Clock className="h-3 w-3 ml-2" />
              {match.date && (
                <span>
                  {new Date(match.date).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {timeUntil && (
              <Badge
                variant={
                  urgency === "urgent"
                    ? "destructive"
                    : urgency === "soon"
                      ? "secondary"
                      : "default"
                }
                className={cn(
                  "text-xs font-mono",
                  urgency === "urgent" &&
                    "bg-red-500 hover:bg-red-600 text-white",
                  urgency === "soon" &&
                    "bg-orange-500 hover:bg-orange-600 text-white",
                  urgency === "normal" &&
                    "bg-blue-500 hover:bg-blue-600 text-white",
                )}
              >
                <Clock className="h-3 w-3 mr-1" />
                Dans {timeUntil}
              </Badge>
            )}
            {onFavorite && (
              <button
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                onClick={onFavorite}
                title={
                  isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
                }
              >
                <Star
                  className={`h-4 w-4 ${isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span
              className={cn(
                "transition-colors",
                match.team1_id === userTeamId
                  ? "font-semibold text-primary"
                  : "text-muted-foreground",
              )}
            >
              {match.team1.name}
            </span>
            <span className="text-muted-foreground font-medium">vs</span>
            <span
              className={cn(
                "transition-colors",
                match.team2_id === userTeamId
                  ? "font-semibold text-primary"
                  : "text-muted-foreground",
              )}
            >
              {match.team2.name}
            </span>
          </div>
        </div>

        {/* Enhanced Clickable Location */}
        {match.location && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openMap(match.location!)}
            className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 hover:bg-slate-100 p-3 rounded-lg transition-colors w-full justify-start h-auto"
          >
            <MapPin className="h-4 w-4 " />
            <div className="flex flex-col items-start gap-1">
              <span className="font-medium text-gray-700">
                {match.location.name}
              </span>
              {match.location.address && (
                <span className="text-xs text-gray-500">
                  {match.location.address}
                </span>
              )}
            </div>
            <div className="ml-auto flex items-center gap-1 ">
              <span className="text-xs font-medium">Naviguer</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};
