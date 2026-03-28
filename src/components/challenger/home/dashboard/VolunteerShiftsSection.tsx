"use client";

import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { VolunteerShiftCard, Shift } from "./VolunteerShiftCard";

interface VolunteerShiftsSectionProps {
  shifts: Shift[];
  currentTime: Date;
  onSelectShift: (id: string) => void;
}

export const VolunteerShiftsSection = ({
  shifts,
  currentTime,
  onSelectShift,
}: VolunteerShiftsSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Heart className="h-4 w-4 text-violet-500 fill-violet-500" />
          Mes Prochains Créneaux ({shifts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {shifts.length === 0 ? (
          <div className="text-center py-4">
            <Heart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Aucun créneau à venir
            </p>
          </div>
        ) : (
          shifts.map((shift) => (
            <VolunteerShiftCard
              key={shift.id}
              shift={shift}
              currentTime={currentTime}
              onSelect={onSelectShift}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
