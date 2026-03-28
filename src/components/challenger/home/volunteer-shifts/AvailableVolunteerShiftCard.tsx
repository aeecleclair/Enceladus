import { VolunteerShiftComplete } from "../../../api/hyperionSchemas";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
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
  User,
  Award,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocations } from "../../../hooks/useLocations";
import {
  generateLocationColor,
  getLocationDetails,
  openLocationMap,
} from "../../../utils/locationColors";

interface AvailableVolunteerShiftCardProps {
  shift: VolunteerShiftComplete;
  onClick: () => void;
}

export const AvailableVolunteerShiftCard = ({
  shift,
  onClick,
}: AvailableVolunteerShiftCardProps) => {
  const { locations } = useLocations();
  const startDate = new Date(shift.start_time);
  const endDate = new Date(shift.end_time);

  // Calculate duration in hours
  const durationHours = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
  );

  // Calculate time until the shift
  const now = new Date();
  const timeDiff = startDate.getTime() - now.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const getTimeDescription = () => {
    if (daysDiff === 0) {
      if (hoursDiff <= 1) return "Dans moins d'une heure";
      return `Dans ${hoursDiff}h`;
    }
    if (daysDiff === 1) return "Demain";
    if (daysDiff <= 7) return `Dans ${daysDiff} jours`;
    return `Dans ${daysDiff} jours`;
  };

  const getUrgencyColor = () => {
    if (daysDiff === 0) return "destructive"; // Today
    if (daysDiff <= 1) return "default"; // Tomorrow
    return "secondary"; // Later
  };

  const locationDetails = getLocationDetails(shift.location, locations);
  const locationColor = generateLocationColor(locationDetails.id);

  const openMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    openLocationMap(shift.location, locations);
  };

  const getVolunteerTooltip = () => {
    const managerInfo = `Responsable: ${shift.manager.firstname} ${shift.manager.name}`;
    const capacityInfo = `Capacité: ${shift.max_volunteers} bénévole${shift.max_volunteers > 1 ? "s" : ""}`;
    const pointsInfo = `Valeur: ${shift.value} point${shift.value > 1 ? "s" : ""}`;

    return `${managerInfo}\n${capacityInfo}\n${pointsInfo}`;
  };

  return (
    <TooltipProvider>
      <Card
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Shift info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: locationColor }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">
                  {shift.name}
                </h3>
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
                        onClick={openMap}
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
                    <span>0/{shift.max_volunteers}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getVolunteerTooltip()}</p>
                </TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span
                  className="truncate max-w-20"
                  title={`${shift.manager.firstname} ${shift.manager.name}`}
                >
                  {shift.manager.firstname} {shift.manager.name.charAt(0)}.
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                <span>{shift.value}pts</span>
              </div>
            </div>

            {/* Right side - Status and Action */}
            <div className="flex items-center gap-2">
              <Badge variant={getUrgencyColor()} className="text-xs">
                {getTimeDescription()}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="text-xs px-2 py-1"
              >
                S&apos;inscrire
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
