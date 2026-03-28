"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";
import { useVolunteerShifts } from "@/src/hooks/useVolunteerShifts";
import { useMemo } from "react";
import { Badge } from "../../ui/badge";

export function NavVolunteerShifts() {
  const router = useRouter();
  const { volunteerShifts } = useVolunteerShifts();

  const unfilledCount = useMemo(() => {
    if (!volunteerShifts) return 0;
    return volunteerShifts.filter(
      (s) => (s.registrations?.length ?? 0) < s.max_volunteers,
    ).length;
  }, [volunteerShifts]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/volunteer-shifts")}
          className="cursor-pointer hover:underline flex items-center gap-1 flex-wrap"
        >
          Créneaux Bénévoles{" "}
          {(volunteerShifts?.length ?? 0) > 0 &&
            `(${volunteerShifts!.length})`}
          {unfilledCount > 0 && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-800 border-amber-300"
            >
              {unfilledCount} incomplets
            </Badge>
          )}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
