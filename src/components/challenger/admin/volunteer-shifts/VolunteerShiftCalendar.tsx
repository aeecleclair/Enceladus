"use client";

import { VolunteerShiftComplete } from "../../../api/hyperionSchemas";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarWeekView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarEvent,
} from "../../custom/FullScreenCalendar";
import { useMemo } from "react";
import { format, isSameDay, startOfDay, endOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { generateLocationColor } from "../../../utils/locationColors";

interface VolunteerShiftCalendarProps {
  displayShifts: VolunteerShiftComplete[];
  shifts: VolunteerShiftComplete[];
  onEventClick?: (shift: VolunteerShiftComplete) => void;
  onEmptySlotClick?: (date: Date, hour?: number) => void;
}

export default function VolunteerShiftCalendar({
  displayShifts,
  shifts,
  onEventClick,
  onEmptySlotClick,
}: VolunteerShiftCalendarProps) {

  console.log(displayShifts);
  const events: CalendarEvent[] = useMemo(() => {
    return displayShifts.flatMap((shift) => {
      const baseEvent: CalendarEvent = {
        id: shift.id?.toString() || "",
        title: shift.name || "Créneau",
        subtitle: `Max ${shift.max_volunteers} bénévole${shift.max_volunteers !== 1 ? "s" : ""}`,
        start: new Date(shift.start_time),
        end: new Date(shift.end_time),
        color: generateLocationColor(shift.location),
        metadata: {
          maxVolunteers: shift.max_volunteers || 0,
          location: shift.location,
        },
      };
      return baseEvent;
    });
  }, [displayShifts]);

  const handleEventClick = (event: CalendarEvent) => {
    if (onEventClick) {
      // Strip -dN suffix from split fragment IDs to find the original shift
      const originalId = event.id.toString().replace(/-d\d+$/, "");
      const shift = shifts.find((s) => s.id?.toString() === originalId);
      if (shift) {
        onEventClick(shift);
      }
    }
  };

  return (
    <Calendar
      events={events}
      onEventClick={handleEventClick}
      onEmptySlotClick={onEmptySlotClick}
      locale={fr}
      view="week"
    >
      <div className="flex flex-col space-y-4">
        {/* Calendar Header */}
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
          <div className="flex items-center justify-center gap-6 p-4">
            {displayShifts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {displayShifts.reduce((sum, shift) => sum + shift.max_volunteers, 0)}{" "}
                  places disponibles au total
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Calendar */}
        <CalendarWeekView />
      </div>
    </Calendar>
  );
}
