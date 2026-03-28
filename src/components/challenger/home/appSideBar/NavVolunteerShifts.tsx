"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { Badge } from "../../ui/badge";
import { useRouter } from "next/navigation";
import { useVolunteer } from "@/src/hooks/useVolunteer";
import { useMemo, useState, useEffect } from "react";

export function NavVolunteerShifts() {
  const router = useRouter();
  const { volunteer } = useVolunteer();

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const { upcomingCount, imminentShift } = useMemo(() => {
    if (!volunteer) return { upcomingCount: 0, imminentShift: null };

    const upcoming = volunteer.filter(
      (r) => new Date(r.shift.start_time).getTime() > now,
    );

    let imminent: { location: string; minutesUntil: number } | null = null;
    for (const r of upcoming) {
      const diff = Math.round(
        (new Date(r.shift.start_time).getTime() - now) / 60_000,
      );
      if (diff <= 30 && (!imminent || diff < imminent.minutesUntil)) {
        imminent = {
          location: r.shift.location ?? r.shift.name,
          minutesUntil: diff,
        };
      }
    }

    return { upcomingCount: upcoming.length, imminentShift: imminent };
  }, [volunteer, now]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/volunteer-shifts")}
          className="cursor-pointer hover:underline flex items-center gap-1.5 flex-wrap"
        >
          Bénévolat
          {imminentShift ? (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-red-100 text-red-800 border-red-300 animate-pulse"
            >
              {imminentShift.location} dans {imminentShift.minutesUntil}min
            </Badge>
          ) : upcomingCount > 0 ? (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-800 border-blue-300"
            >
              {upcomingCount} créneau{upcomingCount > 1 ? "x" : ""} à venir
            </Badge>
          ) : null}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
