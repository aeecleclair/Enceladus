import { VolunteerRegistrationComplete } from "../../../api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { History, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { VolunteerShiftCard } from ".";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PastVolunteerShiftsProps {
  shifts: (VolunteerRegistrationComplete & { _shiftStartTime: number })[];
}

export const PastVolunteerShifts = ({ shifts }: PastVolunteerShiftsProps) => {
  const [showAllShifts, setShowAllShifts] = useState(false);

  // Group by day (descending order since past shifts are sorted most recent first)
  const groupedByDay = useMemo(() => {
    const groups: Record<
      string,
      (VolunteerRegistrationComplete & { _shiftStartTime: number })[]
    > = {};
    shifts.forEach((reg) => {
      const key = format(new Date(reg.shift.start_time), "yyyy-MM-dd");
      if (!groups[key]) groups[key] = [];
      groups[key].push(reg);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [shifts]);

  if (shifts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Créneaux Terminés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucun créneau de bénévolat terminé pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayedShifts = showAllShifts ? shifts : shifts.slice(0, 5);
  const displayedIds = new Set(displayedShifts.map((r) => r.shift_id));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5" />
          Créneaux Terminés ({shifts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {groupedByDay.map(([dateKey, dayRegs]) => {
          const visibleRegs = dayRegs.filter((r) =>
            displayedIds.has(r.shift_id),
          );
          if (visibleRegs.length === 0) return null;
          const dayDate = new Date(dayRegs[0].shift.start_time);
          return (
            <div key={dateKey}>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 capitalize">
                {format(dayDate, "EEEE d MMMM", { locale: fr })}
              </h4>
              <div className="space-y-2">
                {visibleRegs.map((registration) => (
                  <VolunteerShiftCard
                    key={registration.shift_id}
                    registration={registration}
                    isUpcoming={false}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {shifts.length > 5 && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setShowAllShifts(!showAllShifts)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showAllShifts ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Voir moins
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Voir tous les créneaux ({shifts.length - 5} de plus)
                </>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
