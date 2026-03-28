"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Badge } from "../../ui/badge";
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type {
  VolunteerShiftCompleteWithVolunteers,
  VolunteerRegistrationWithUser,
} from "@/src/api/hyperionSchemas";

export interface VolunteerRow {
  userId: string;
  fullName: string;
  email: string;
  schoolName: string;
  shiftCount: number;
  validatedCount: number;
  points: number;
  potentialPoints: number;
  registrations: {
    shift: VolunteerShiftCompleteWithVolunteers;
    registration: VolunteerRegistrationWithUser;
  }[];
}

interface VolunteerDetailDialogProps {
  volunteer: VolunteerRow;
  open: boolean;
  onClose: () => void;
}

export default function VolunteerDetailDialog({
  volunteer,
  open,
  onClose,
}: VolunteerDetailDialogProps) {
  const sortedRegistrations = [...volunteer.registrations].sort(
    (a, b) =>
      new Date(a.shift.start_time).getTime() -
      new Date(b.shift.start_time).getTime(),
  );

  const initials = volunteer.fullName
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const pendingCount = volunteer.shiftCount - volunteer.validatedCount;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl flex flex-col gap-0 p-0 overflow-hidden max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30 shrink-0">
          <DialogTitle asChild>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-lg font-bold text-primary-foreground">
                  {initials}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-xl font-semibold leading-tight">
                  {volunteer.fullName}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5 truncate">
                  {volunteer.email}
                  {volunteer.schoolName !== "-" && (
                    <span className="ml-2 text-xs font-medium text-foreground/60">
                      · {volunteer.schoolName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-3 px-6 py-4 border-b shrink-0">
          {/* Points */}
          <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Star className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold leading-none">
                {volunteer.points}
                {volunteer.potentialPoints > volunteer.points && (
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    / {volunteer.potentialPoints}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Points validés
              </div>
            </div>
          </div>

          {/* Shifts */}
          <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-xl font-bold leading-none">
                {volunteer.shiftCount}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {volunteer.validatedCount > 0 && (
                  <span className="text-green-600 font-medium">
                    {volunteer.validatedCount} validé
                    {volunteer.validatedCount > 1 ? "s" : ""}
                  </span>
                )}
                {pendingCount > 0 && (
                  <span className="text-orange-500 font-medium ml-1">
                    {volunteer.validatedCount > 0 && "· "}
                    {pendingCount} en attente
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shifts list — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Créneaux ({sortedRegistrations.length})
          </p>
          <ul className="space-y-2">
            {sortedRegistrations.map(({ shift, registration }) => {
              const startDate = new Date(shift.start_time);
              const endDate = new Date(shift.end_time);
              const durationHours =
                Math.round(
                  (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 30),
                ) / 2;

              return (
                <li
                  key={`${shift.id}-${registration.user_id}`}
                  className={`flex items-start justify-between gap-4 rounded-lg border p-3 ${
                    registration.validated
                      ? "border-l-4 border-l-green-500 bg-green-50/40"
                      : "border-l-4 border-l-orange-400 bg-orange-50/40"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{shift.name}</span>
                      <Badge
                        variant="outline"
                        className="text-xs shrink-0 flex items-center gap-1 py-0"
                      >
                        <Award className="h-3 w-3" />
                        {shift.value} pts
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 shrink-0" />
                        {format(startDate, "EEEE d MMMM", { locale: fr })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        {format(startDate, "HH:mm")} –{" "}
                        {format(endDate, "HH:mm")}
                        <span className="text-muted-foreground/70">
                          ({durationHours}h)
                        </span>
                      </span>
                      {shift.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {shift.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 mt-0.5">
                    {registration.validated ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 text-xs gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Validé
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-orange-300 text-orange-600 text-xs gap-1"
                      >
                        <XCircle className="h-3 w-3" />
                        En attente
                      </Badge>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
