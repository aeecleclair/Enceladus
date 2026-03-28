"use client";

import { MapPin, Clock } from "lucide-react";
import { getTimeUntilEvent, getTimeBadgeClass } from "./matchUtils";
import { generateLocationColor } from "@/src/utils/locationColors";

export interface Shift {
  id: string;
  name: string;
  start: string;
  end?: string | null;
  location: string | null;
}

interface VolunteerShiftCardProps {
  shift: Shift;
  currentTime: Date;
  onSelect: (id: string) => void;
}

export const VolunteerShiftCard = ({
  shift,
  currentTime,
  onSelect,
}: VolunteerShiftCardProps) => {
  const color = generateLocationColor(shift.location);

  const timeStart = new Date(shift.start).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const timeEnd = shift.end
    ? new Date(shift.end).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      className="flex items-stretch gap-3 rounded-xl border bg-white cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
      onClick={() => onSelect(shift.id)}
    >
      {/* Time block */}
      <div
        className="flex flex-col items-center justify-center px-3 py-3 min-w-[64px] flex-shrink-0"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, white)` }}
      >
        <span className="text-xs font-black tabular-nums" style={{ color }}>
          {timeStart}
        </span>
        {timeEnd && (
          <>
            <span className="text-[10px] leading-none my-0.5" style={{ color, opacity: 0.5 }}>↓</span>
            <span className="text-xs font-semibold tabular-nums" style={{ color, opacity: 0.7 }}>
              {timeEnd}
            </span>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-between gap-2 py-3 pr-3 min-w-0">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{shift.name}</p>
          {shift.location && (
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 flex-shrink-0" style={{ color }} />
              <p className="text-xs text-muted-foreground truncate">{shift.location}</p>
            </div>
          )}
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getTimeBadgeClass(shift.start, currentTime)}`}
          >
            {getTimeUntilEvent(shift.start, currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
};
