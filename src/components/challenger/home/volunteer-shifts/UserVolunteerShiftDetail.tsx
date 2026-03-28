import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Award,
  UserPlus,
  UserMinus,
  ExternalLink,
  CheckCircle,
  Timer,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useVolunteer } from "../../../hooks/useVolunteer";
import { useVolunteerShifts } from "../../../hooks/useVolunteerShifts";
import { useLocations } from "../../../hooks/useLocations";
import { LoadingButton } from "../../custom/LoadingButton";
import { VolunteerShiftComplete } from "../../../api/hyperionSchemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  generateLocationColor,
  getLocationDetails,
  openLocationMap,
} from "../../../utils/locationColors";

interface UserVolunteerShiftDetailProps {
  shiftId: string;
  onClose: () => void;
}

export default function UserVolunteerShiftDetail({
  shiftId,
  onClose,
}: UserVolunteerShiftDetailProps) {
  const {
    volunteer,
    registerVolunteerShift,
    isRegisterLoading,
    unregisterVolunteerShift,
    isUnregisterLoading,
    refetchVolunteer,
  } = useVolunteer();
  const { volunteerShifts } = useVolunteerShifts();
  const { locations } = useLocations();

  const shift = volunteerShifts?.find(
    (s: VolunteerShiftComplete) => s.id === shiftId,
  );
  const myRegistration = volunteer?.find((reg) => reg.shift_id === shiftId);
  const isRegistered = !!myRegistration;

  if (!shift) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <p>Créneau non trouvé</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const startDate = new Date(shift.start_time);
  const endDate = new Date(shift.end_time);
  const isUpcoming = startDate > new Date();
  const isPast = endDate < new Date();
  const durationMinutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60),
  );
  const durationLabel =
    durationMinutes % 60 === 0
      ? `${durationMinutes / 60}h`
      : `${Math.floor(durationMinutes / 60)}h${String(durationMinutes % 60).padStart(2, "0")}`;

  const getStatusBadge = () => {
    if (isPast)
      return (
        <Badge variant="secondary" className="text-xs">
          Terminé
        </Badge>
      );
    if (!isUpcoming)
      return (
        <Badge className="text-xs bg-green-500 hover:bg-green-600">
          En cours
        </Badge>
      );
    return (
      <Badge variant="outline" className="text-xs">
        À venir
      </Badge>
    );
  };

  const handleRegister = () => {
    registerVolunteerShift(shift.id, () => {
      refetchVolunteer();
      onClose();
    });
  };

  const handleUnregister = () => {
    unregisterVolunteerShift(shift.id, () => {
      refetchVolunteer();
      onClose();
    });
  };

  const locationDetails = getLocationDetails(shift.location, locations);
  const locationColor = generateLocationColor(shift.location);

  const openMap = () => {
    openLocationMap(shift.location, locations);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {/* Coloured header strip */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: locationColor }}
        />

        <div className="px-6 pt-4 pb-6 space-y-5">
          {/* Title row */}
          <DialogHeader>
            <DialogTitle className="flex items-start justify-between gap-3">
              <span className="text-lg leading-tight">{shift.name}</span>
              <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                {getStatusBadge()}
                {isRegistered && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-800"
                  >
                    Inscrit
                  </Badge>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Description */}
          {shift.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {shift.description}
            </p>
          )}

          <Separator />

          {/* Info rows */}
          <div className="space-y-3 text-sm">
            {/* Date & time */}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium capitalize">
                {format(startDate, "EEEE d MMMM", { locale: fr })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>
                {format(startDate, "HH:mm")} – {format(endDate, "HH:mm")}
              </span>
              <Badge variant="outline" className="text-xs ml-1">
                <Timer className="h-3 w-3 mr-1" />
                {durationLabel}
              </Badge>
            </div>

            {/* Location */}
            {shift.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: locationColor }}
                  />
                  <span>{locationDetails.name}</span>
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

            {/* Manager */}
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Responsable :</span>
              <span className="font-medium">
                {shift.manager.firstname} {shift.manager.name}
              </span>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Capacité :</span>
              <span>
                {shift.max_volunteers} bénévole
                {shift.max_volunteers > 1 ? "s" : ""}
              </span>
            </div>

            {/* Points */}
            <div className="flex items-center gap-3">
              <Award className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Récompense :</span>
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 text-xs"
              >
                {shift.value} point{shift.value > 1 ? "s" : ""}
              </Badge>
            </div>
          </div>

          {/* My registration status */}
          {isRegistered && myRegistration && (
            <>
              <Separator />
              <div className="rounded-lg border px-4 py-3 space-y-1 bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Mon inscription
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Inscrit le{" "}
                    {format(
                      new Date(myRegistration.registered_at),
                      "d MMM à HH:mm",
                      { locale: fr },
                    )}
                  </span>
                  {myRegistration.validated ? (
                    <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Participation validée
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs text-muted-foreground"
                    >
                      En attente de validation
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Action footer */}
          <div className="flex justify-end pt-1">
            {isRegistered ? (
              isUpcoming ? (
                <LoadingButton
                  onClick={handleUnregister}
                  isLoading={isUnregisterLoading}
                  variant="destructive"
                  size="sm"
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  Se désinscrire
                </LoadingButton>
              ) : null
            ) : isPast ? null : (
              <LoadingButton
                onClick={handleRegister}
                isLoading={isRegisterLoading}
                size="sm"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                S&apos;inscrire
              </LoadingButton>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
