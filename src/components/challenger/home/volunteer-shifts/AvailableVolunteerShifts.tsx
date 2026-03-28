import { VolunteerShiftComplete } from "../../../api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Calendar, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { AvailableVolunteerShiftCard } from "./AvailableVolunteerShiftCard";
import { useVolunteer } from "../../../hooks/useVolunteer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AvailableVolunteerShiftsProps {
  shifts: VolunteerShiftComplete[];
  registeredShiftIds: string[];
}

export const AvailableVolunteerShifts = ({
  shifts,
  registeredShiftIds,
}: AvailableVolunteerShiftsProps) => {
  const [showAllShifts, setShowAllShifts] = useState(false);
  const { registerVolunteerShift, isRegisterLoading, refetchVolunteer } =
    useVolunteer();

  const handleRegister = (shiftId: string) => {
    registerVolunteerShift(shiftId, () => {
      refetchVolunteer();
    });
  };

  // Filter out past shifts and already registered shifts
  const now = new Date();
  const availableShifts = shifts.filter((shift) => {
    const shiftStart = new Date(shift.start_time);
    return shiftStart > now && !registeredShiftIds.includes(shift.id);
  });

  // Group by day
  const groupedByDay = useMemo(() => {
    const groups: Record<string, VolunteerShiftComplete[]> = {};
    availableShifts.forEach((shift) => {
      const key = format(new Date(shift.start_time), "yyyy-MM-dd");
      if (!groups[key]) groups[key] = [];
      groups[key].push(shift);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [availableShifts]);

  if (availableShifts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Créneaux Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucun créneau de bénévolat disponible pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayedShifts = showAllShifts
    ? availableShifts
    : availableShifts.slice(0, 5);

  // Build a set of displayed shift ids for filtering groups
  const displayedIds = new Set(displayedShifts.map((s) => s.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Créneaux Disponibles ({availableShifts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {groupedByDay.map(([dateKey, dayShifts]) => {
          const visibleShifts = dayShifts.filter((s) => displayedIds.has(s.id));
          if (visibleShifts.length === 0) return null;
          const dayDate = new Date(dayShifts[0].start_time);
          return (
            <div key={dateKey}>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 capitalize">
                {format(dayDate, "EEEE d MMMM", { locale: fr })}
              </h4>
              <div className="space-y-2">
                {visibleShifts.map((shift) => (
                  <AvailableVolunteerShiftCard
                    key={shift.id}
                    shift={shift}
                    onClick={() => handleRegister(shift.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {availableShifts.length > 5 && (
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
                  Voir tous les créneaux ({availableShifts.length - 5} de plus)
                </>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
