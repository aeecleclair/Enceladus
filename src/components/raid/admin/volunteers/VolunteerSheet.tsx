"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ParticipantInfo } from "@/components/raid/custom/ParticipantInfo";
import { useAdminVolunteers } from "@/hooks/raid/useAdminVolunteers";
import { RaidVolunteer } from "@/api";
import { formatDate } from "@/lib/dateFormat";
import { getVolunteerStatus } from "@/lib/raid/volunteerStatus";
import {
  Car,
  HeartHandshake,
  ShieldCheck,
  Truck,
  Map as MapIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface VolunteerSheetProps {
  isOpened: boolean;
  onClose: () => void;
  volunteer: RaidVolunteer | null;
}

export const VolunteerSheet = ({
  isOpened,
  onClose,
  volunteer,
}: VolunteerSheetProps) => {
  const {
    validateVolunteer,
    cancelVolunteer,
    deleteVolunteer,
    isValidateLoading,
    isCancelLoading,
    isDeleteLoading,
  } = useAdminVolunteers();
  const t = useTranslations("raid.admin.volunteers");
  const ts = useTranslations("raid.admin.volunteers.sheet");
  const td = useTranslations("raid.volunteer.dashboard");

  if (!volunteer) return null;

  const status = getVolunteerStatus(volunteer, {
    cancelled: td("cancelled"),
    validated: td("validated"),
    pending: td("pending"),
  });
  const carSeats = volunteer.car_seats ?? 0;

  return (
    <Sheet open={isOpened} onOpenChange={onClose}>
      <SheetContent side="team" className="flex flex-col gap-0 p-0">
        <SheetHeader className="gap-3 border-b border-border/60 bg-muted/20 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-700 dark:text-orange-400">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <SheetTitle className="text-2xl tracking-tight">
                {volunteer.user.firstname} {volunteer.user.name}
              </SheetTitle>
              <SheetDescription>
                {ts("registeredOn", { date: formatDate(volunteer.created_at) })}
              </SheetDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
            {volunteer.has_car && (
              <Badge variant="outline" className="gap-1">
                <Car className="h-3 w-3" />
                {ts("seats", { count: carSeats })}
              </Badge>
            )}
            {volunteer.is_special_driver && (
              <Badge variant="outline" className="gap-1">
                <ShieldCheck className="h-3 w-3" /> {t("roleSpecial")}
              </Badge>
            )}
            {volunteer.is_utility_vehicle_driver && (
              <Badge variant="outline" className="gap-1">
                <Truck className="h-3 w-3" /> {t("roleUtility")}
              </Badge>
            )}
            {volunteer.is_parcours_helper && (
              <Badge variant="outline" className="gap-1">
                <MapIcon className="h-3 w-3" /> {t("roleParcours")}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="space-y-4 px-6 py-5">
            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">{ts("identity")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ParticipantInfo
                  label={ts("email")}
                  value={volunteer.user.email}
                />
                <ParticipantInfo
                  label={ts("phone")}
                  value={volunteer.user.phone}
                  isPhone
                />
                <ParticipantInfo
                  label={ts("birthday")}
                  value={formatDate(volunteer.user.birthday)}
                />
              </CardContent>
            </Card>
            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">
                  {ts("volunteeringInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ParticipantInfo
                  label={ts("diet")}
                  value={volunteer.diet}
                  placeholder={ts("noDiet")}
                />
                <ParticipantInfo
                  label={ts("allergy")}
                  value={volunteer.allergy}
                  placeholder={ts("noAllergy")}
                />
                <ParticipantInfo
                  label={ts("car")}
                  value={
                    volunteer.has_car
                      ? t("carYes", { seats: carSeats })
                      : t("carNo")
                  }
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex flex-wrap gap-2 border-t border-border/60 bg-muted/10 px-6 py-4">
          {!volunteer.validated && !volunteer.cancelled && (
            <Button
              size="sm"
              onClick={() => validateVolunteer(volunteer.user_id)}
              disabled={isValidateLoading}
            >
              {t("actions.validate")}
            </Button>
          )}
          {!volunteer.cancelled && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => cancelVolunteer(volunteer.user_id)}
              disabled={isCancelLoading}
            >
              {t("actions.cancel")}
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => deleteVolunteer(volunteer.user_id, onClose)}
            disabled={isDeleteLoading}
          >
            {t("actions.delete")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
