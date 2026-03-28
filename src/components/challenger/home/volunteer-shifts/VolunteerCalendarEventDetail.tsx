"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { CalendarEvent } from "../../custom/FullScreenCalendar";
import UserVolunteerShiftDetail from "./UserVolunteerShiftDetail";

interface VolunteerCalendarEventDetailProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export const VolunteerCalendarEventDetail = ({
  event,
  onClose,
}: VolunteerCalendarEventDetailProps) => {
  if (!event) return null;

  const eventType = event.metadata?.type as "shift" | undefined;

  // Shift events: delegate to UserVolunteerShiftDetail (it opens its own dialog)
  if (eventType === "shift") {
    return (
      <UserVolunteerShiftDetail
        shiftId={event.metadata!.shiftId as string}
        onClose={onClose}
      />
    );
  }

  // Fallback: generic event detail
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{event.subtitle}</p>
      </DialogContent>
    </Dialog>
  );
};
