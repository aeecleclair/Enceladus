"use client";

import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarEvent,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
} from "../../custom/FullScreenCalendar";
import { VolunteerCalendarEventDetail } from "./VolunteerCalendarEventDetail";

import { useVolunteer } from "@/hooks/challenger/useVolunteer";
import { useVolunteerShifts } from "@/hooks/challenger/useVolunteerShifts";
import { generateLocationColor } from "@/lib/challenger/locationColors";

import { useMemo, useState } from "react";

import { endOfDay, isSameDay, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const VolunteerCalendar = () => {
  const { splitVolunteerShifts } = useVolunteerShifts();
  const { volunteer } = useVolunteer();

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const registeredShiftIds = useMemo(
    () => new Set(volunteer?.map((r) => r.shift_id) ?? []),
    [volunteer],
  );

  const events: CalendarEvent[] = useMemo(() => {
    if (!splitVolunteerShifts) return [];
    return splitVolunteerShifts.flatMap((shift) => {
      const isRegistered = registeredShiftIds.has(shift.id);
      const baseEvent: CalendarEvent = {
        id: `shift-${shift.id}`,
        title: isRegistered ? `✓ ${shift.name}` : shift.name,
        subtitle: `Max ${shift.max_volunteers} bénévole${shift.max_volunteers !== 1 ? "s" : ""}`,
        start: new Date(shift.start_time),
        end: new Date(shift.end_time),
        color: generateLocationColor(shift.location),
        metadata: {
          type: "shift",
          shiftId: shift.id,
          isRegistered,
          location: shift.location,
        },
      };
      return baseEvent;
    });
  }, [splitVolunteerShifts, registeredShiftIds]);

  const handleEventClick = (event: CalendarEvent) => {
    // Strip -dN suffix from split fragment IDs to find the original shift
    const originalShiftId =
      event.metadata?.shiftId?.replace(/-d\d+$/, "") ||
      event.id.replace(/-d\d+$/, "").replace(/^shift-/, "");

    setSelectedEvent({
      ...event,
      metadata: {
        ...event.metadata,
        shiftId: originalShiftId,
      },
    });
  };

  return (
    <>
      <Calendar
        events={events}
        onEventClick={handleEventClick}
        locale={fr}
        view="day"
      >
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <CalendarPrevTrigger className="p-2 hover:bg-muted rounded">
                <ChevronLeft className="h-4 w-4" />
              </CalendarPrevTrigger>
              <CalendarTodayTrigger className="px-3 py-1 text-sm border rounded hover:bg-muted">
                Aujourd&apos;hui
              </CalendarTodayTrigger>
              <CalendarNextTrigger className="p-2 hover:bg-muted rounded">
                <ChevronRight className="h-4 w-4" />
              </CalendarNextTrigger>
            </div>

            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <CalendarCurrentDate locale={fr} />
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ backgroundColor: "#6b7280" }}
                />
                Créneaux
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium">✓</span>
                Inscrit
              </div>
            </div>
          </div>

          {/* Calendar */}
          <CalendarDayView />
        </div>
      </Calendar>

      <VolunteerCalendarEventDetail
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
};
