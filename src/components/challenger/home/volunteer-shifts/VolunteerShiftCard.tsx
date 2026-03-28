import { VolunteerRegistrationComplete } from "../../../api/hyperionSchemas";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "../../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  Award,
  ExternalLink,
  CheckCircle,
  UserMinus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocations } from "../../../hooks/useLocations";
import {
  generateLocationColor,
  getLocationName,
  getLocationDetails,
  openLocationMap,
} from "../../../utils/locationColors";

interface VolunteerShiftCardProps {
  registration: VolunteerRegistrationComplete;
  isUpcoming: boolean;
  onUnregister?: () => void;
  isUnregisterLoading?: boolean;
}

export const VolunteerShiftCard = ({
  registration,
  isUpcoming,
  onUnregister,
  isUnregisterLoading,
}: VolunteerShiftCardProps) => {
  const { shift, validated } = registration;
  const { locations } = useLocations();
  const startDate = new Date(shift.start_time);
  const endDate = new Date(shift.end_time);

  const durationHours = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
  );

  const now = new Date();
  const timeDiff = Math.abs(startDate.getTime() - now.getTime());
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const getTimeDescription = () => {
    if (isUpcoming) {
      if (daysDiff === 0) {
        if (hoursDiff <= 1) return "Dans moins d'une heure";
        return `Dans ${hoursDiff}h`;
      }
      if (daysDiff === 1) return "Demain";
      if (daysDiff <= 7) return `Dans ${daysDiff} jours`;
      return `Dans ${daysDiff} jours`;
    } else {
      if (daysDiff === 0) return "Aujourd'hui";
      if (daysDiff === 1) return "Hier";
      return `Il y a ${daysDiff} jours`;
    }
  };

  const getUrgencyColor = () => {
    if (!isUpcoming) return "default";
    if (daysDiff === 0) return "destructive";
    if (daysDiff <= 1) return "default";
    return "secondary";
  };

  const openMap = (locationId: string | null | undefined) => {
    openLocationMap(locationId, locations);
  };

  const locationDetails = getLocationDetails(shift.location, locations);
  const locationColor = generateLocationColor(locationDetails.id);

  return (
    <TooltipProvider>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Shift info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: locationColor }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base truncate">
                    {shift.name}
                  </h3>
                  {validated && (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600 text-xs"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Validé
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Center - Compact info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(startDate, "dd/MM", { locale: fr })}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {format(startDate, "HH:mm")}-{format(endDate, "HH:mm")}
                </span>
              </div>

              {shift.location && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: locationColor }}
                      />
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-20">
                        {locationDetails.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 opacity-60 hover:opacity-100"
                        onClick={() => openMap(shift.location)}
                      >
                        <ExternalLink className="h-2 w-2" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>
                      <p className="font-medium">{locationDetails.name}</p>
                      {locationDetails.address && (
                        <p className="text-xs">{locationDetails.address}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-help">
                    <Users className="h-3 w-3" />
                    <span>{shift.max_volunteers}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Capacité maximum: {shift.max_volunteers} bénévoles</p>
                </TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                <span>{shift.value}pts</span>
              </div>
            </div>

            {/* Right side - Status & actions */}
            <div className="flex items-center gap-2">
              <Badge variant={getUrgencyColor()} className="text-xs">
                {getTimeDescription()}
              </Badge>
              {isUpcoming && onUnregister && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnregister();
                      }}
                      disabled={isUnregisterLoading}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Se désinscrire</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
