import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Timer,
  ExternalLink,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAllMatches } from "../../../hooks/useAllMatches";
import { useSports } from "../../../hooks/useSports";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { openLocationMap } from "../../../utils/locationColors";
import { useLocations } from "../../../hooks/useLocations";

interface MatchDetailDialogProps {
  matchId: string;
  onClose: () => void;
}

export default function MatchDetailDialog({
  matchId,
  onClose,
}: MatchDetailDialogProps) {
  const { allMatches } = useAllMatches();
  const { sports } = useSports();
  const { locations } = useLocations();

  const match = allMatches?.find((m) => m.id === matchId);

  if (!match) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <p>Match non trouvé</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const sportName = sports?.find((s) => s.id === match.sport_id)?.name || "Sport";
  const now = new Date();
  const matchDate = match.date ? new Date(match.date) : null;
  const isLive = matchDate && matchDate <= now && !match.ended;
  const isPast = match.ended;
  const isUpcoming = !match.ended && matchDate && matchDate > now;

  const getStatusBadge = () => {
    if (match.ended)
      return (
        <Badge variant="secondary" className="text-xs">
          Terminé
        </Badge>
      );
    if (isLive)
      return (
        <Badge className="text-xs bg-red-500 hover:bg-red-600">
          En direct
        </Badge>
      );
    return (
      <Badge variant="outline" className="text-xs">
        À venir
      </Badge>
    );
  };

  const openMap = () => {
    if (match.location) {
      openLocationMap(match.location.name, locations);
    }
  };

  const winnerTeam =
    match.winner_id === match.team1_id
      ? match.team1
      : match.winner_id === match.team2_id
        ? match.team2
        : null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {/* Coloured header strip */}
        <div
          className={`h-1.5 w-full ${isLive ? "bg-red-500" : match.ended ? "bg-gray-400" : "bg-blue-500"}`}
        />

        <div className="px-6 pt-4 pb-6 space-y-5">
          {/* Title row */}
          <DialogHeader>
            <DialogTitle className="flex items-start justify-between gap-3">
              <span className="text-lg leading-tight">{match.name}</span>
              <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                {getStatusBadge()}
              </div>
            </DialogTitle>
          </DialogHeader>

          <Badge variant="outline" className="text-xs text-muted-foreground">
            {sportName}
          </Badge>

          <Separator />

          {/* Score / Teams */}
          <div className="grid grid-cols-3 gap-4 items-center text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold text-sm">{match.team1.name}</span>
              {match.score_team1 != null ? (
                <span
                  className={`text-3xl font-bold ${match.winner_id === match.team1_id ? "text-green-600" : ""}`}
                >
                  {match.score_team1}
                </span>
              ) : (
                <span className="text-xl text-muted-foreground">-</span>
              )}
              {match.winner_id === match.team1_id && (
                <Badge className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-100">
                  <Trophy className="h-3 w-3 mr-1" />
                  Vainqueur
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-center">
              <Badge variant="outline" className="text-base px-3 py-1">
                VS
              </Badge>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold text-sm">{match.team2.name}</span>
              {match.score_team2 != null ? (
                <span
                  className={`text-3xl font-bold ${match.winner_id === match.team2_id ? "text-green-600" : ""}`}
                >
                  {match.score_team2}
                </span>
              ) : (
                <span className="text-xl text-muted-foreground">-</span>
              )}
              {match.winner_id === match.team2_id && (
                <Badge className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-100">
                  <Trophy className="h-3 w-3 mr-1" />
                  Vainqueur
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Info rows */}
          <div className="space-y-3 text-sm">
            {matchDate && (
              <>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium capitalize">
                    {format(matchDate, "EEEE d MMMM", { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{format(matchDate, "HH:mm")}</span>
                </div>
              </>
            )}

            {match.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex items-center gap-1.5">
                  <span>{match.location.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 opacity-50 hover:opacity-100"
                    onClick={openMap}
                    title="Ouvrir dans Google Maps"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
