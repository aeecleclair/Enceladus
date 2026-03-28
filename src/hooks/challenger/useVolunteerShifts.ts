import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "../utils/errorTyping";
import {
  useDeleteCompetitionVolunteersShiftsShiftId,
  useGetCompetitionVolunteersShifts,
  usePatchCompetitionVolunteersShiftsShiftId,
  usePatchCompetitionVolunteersShiftsShiftIdUsersUserIdValidation,
  usePostCompetitionVolunteersShifts,
  usePostCompetitionVolunteersShiftsShiftIdRegister,
} from "../api/hyperionComponents";
import {
  VolunteerShiftBase,
  VolunteerShiftCompleteWithVolunteers,
} from "../api/hyperionSchemas";
import { useMemo } from "react";
import { isSameDay, endOfDay, startOfDay } from "date-fns";

/**
 * Split a VolunteerShiftComplete that spans across multiple days into per-day fragments.
 * E.g. a shift from 28/06 13:00 to 29/06 01:00 becomes two shifts:
 *   - 28/06 13:00 → 28/06 23:59:59
 *   - 29/06 00:00 → 29/06 01:00 (named "... (suite)")
 */
function splitMultiDayShift(
  shift: VolunteerShiftCompleteWithVolunteers,
): VolunteerShiftCompleteWithVolunteers[] {
  const start = new Date(shift.start_time);
  const end = new Date(shift.end_time);

  // If technically different days but end time is EXACTLY midnight, it's virtually the same day
  if (
    !isSameDay(start, end) &&
    end.getHours() === 0 &&
    end.getMinutes() === 0 &&
    end.getSeconds() === 0 &&
    end.getTime() > start.getTime()
  ) {
    const prevDayEnd = new Date(end.getTime() - 1);
    if (isSameDay(start, prevDayEnd)) {
      return [shift]; // No split needed
    }
  } else if (isSameDay(start, end)) {
    return [shift];
  }

  const fragments: VolunteerShiftCompleteWithVolunteers[] = [];
  let current = start;
  let index = 0;

  while (current.getTime() < end.getTime()) {
    let segmentEnd = endOfDay(current);
    let isLastSegment = false;

    if (end.getTime() <= segmentEnd.getTime()) {
      segmentEnd = end;
      isLastSegment = true;
    }

    if (current.getTime() < segmentEnd.getTime()) {
      fragments.push({
        ...shift,
        id: `${shift.id}-d${index}`,
        name: index === 0 ? shift.name : `${shift.name} (suite)`,
        start_time: current.toISOString(),
        end_time: segmentEnd.toISOString(),
      });
    }

    if (isLastSegment) {
      break;
    }

    current = new Date(segmentEnd.getTime() + 1);
    index++;
  }

  return fragments.length > 0 ? fragments : [shift];
}

export const useVolunteerShifts = () => {
  const { token, isTokenExpired } = useAuth();
  const {
    data: volunteerShifts,
    isLoading,
    refetch: refetchVolunteerShifts,
  } = useGetCompetitionVolunteersShifts(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: false,
    },
  );

  // Pre-split multi-day shifts for calendar views
  const splitVolunteerShifts = useMemo(() => {
    if (!volunteerShifts) return undefined;
    return volunteerShifts.flatMap(splitMultiDayShift);
  }, [volunteerShifts]);

  const { mutate: mutateCreateVolunteerShift, isPending: isCreateLoading } =
    usePostCompetitionVolunteersShifts();

  const createVolunteerShift = (
    body: VolunteerShiftBase,
    callback: () => void,
  ) => {
    return mutateCreateVolunteerShift(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la création du créneau",
              description:
                (error as any).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchVolunteerShifts();
            callback();
            toast({
              title: "Créneau créé",
              description: "Le créneau a été créé avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateUpdateVolunteerShift, isPending: isUpdateLoading } =
    usePatchCompetitionVolunteersShiftsShiftId();

  const updateVolunteerShift = (
    shiftId: string,
    body: VolunteerShiftBase,
    callback: () => void,
  ) => {
    return mutateUpdateVolunteerShift(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          shiftId: shiftId,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la mise à jour",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchVolunteerShifts();
            callback();
            toast({
              title: "Créneau mis à jour",
              description: "Le créneau a été mis à jour avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeleteVolunteerShift, isPending: isDeleteLoading } =
    useDeleteCompetitionVolunteersShiftsShiftId();

  const deleteVolunteerShift = (shiftId: string, callback: () => void) => {
    return mutateDeleteVolunteerShift(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          shiftId: shiftId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchVolunteerShifts();
            callback();
            toast({
              title: "Créneau supprimé",
              description: "Le créneau a été supprimé avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateValidation, isPending: isValidating } =
    usePatchCompetitionVolunteersShiftsShiftIdUsersUserIdValidation();

  const validateParticipation = (
    shiftId: string,
    userId: string,
    validated: boolean,
  ) => {
    return mutateValidation(
      {
        headers: { Authorization: `Bearer ${token}` },
        pathParams: { shiftId, userId },
        body: { validated },
      },
      {
        onSettled: (_data, error) => {
          if (error) {
            toast({
              title: "Erreur",
              description: "Impossible de mettre à jour la participation.",
              variant: "destructive",
            });
          } else {
            refetchVolunteerShifts();
            toast({
              title: validated ? "Participation validée" : "Validation annulée",
              description: validated
                ? "La participation a été confirmée."
                : "La validation a été annulée.",
            });
          }
        },
      },
    );
  };

  return {
    volunteerShifts,
    splitVolunteerShifts,
    isLoading,
    refetchVolunteerShifts,
    createVolunteerShift,
    isCreateLoading,
    updateVolunteerShift,
    isUpdateLoading,
    deleteVolunteerShift,
    isDeleteLoading,
    validateParticipation,
    isValidating,
  };
};
