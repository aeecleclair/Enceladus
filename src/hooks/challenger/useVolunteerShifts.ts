import { useAuth } from "../useAuth";

import {
  VolunteerShiftBase,
  VolunteerShiftCompleteWithVolunteers,
} from "@/api";
import {
  deleteCompetitionVolunteersShiftsShiftIdMutation,
  getCompetitionVolunteersShiftsOptions,
  patchCompetitionVolunteersShiftsShiftIdMutation,
  patchCompetitionVolunteersShiftsShiftIdUsersUserIdValidationMutation,
  postCompetitionVolunteersShiftsMutation,
} from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useToast } from "@/components/ui/use-toast";

import { endOfDay, isSameDay } from "date-fns";

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
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: volunteerShifts,
    isLoading,
    refetch: refetchVolunteerShifts,
  } = useQuery({
    ...getCompetitionVolunteersShiftsOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  // Pre-split multi-day shifts for calendar views
  const splitVolunteerShifts = useMemo(() => {
    if (!volunteerShifts) return undefined;
    return volunteerShifts.flatMap(splitMultiDayShift);
  }, [volunteerShifts]);

  const { mutate: mutateCreateVolunteerShift, isPending: isCreateLoading } =
    useMutation({
      ...postCompetitionVolunteersShiftsMutation(),
      onSuccess: () => {
        refetchVolunteerShifts();
        toast({
          title: "Créneau créé",
          description: "Le créneau a été créé avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la création du créneau",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
    });

  const createVolunteerShift = (
    body: VolunteerShiftBase,
    callback: () => void,
  ) => {
    return mutateCreateVolunteerShift(
      {
        body,
      },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateUpdateVolunteerShift, isPending: isUpdateLoading } =
    useMutation({
      ...patchCompetitionVolunteersShiftsShiftIdMutation(),
      onSuccess: () => {
        refetchVolunteerShifts();
        toast({
          title: "Créneau mis à jour",
          description: "Le créneau a été mis à jour avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la mise à jour",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
    });

  const updateVolunteerShift = (
    shiftId: string,
    body: VolunteerShiftBase,
    callback: () => void,
  ) => {
    return mutateUpdateVolunteerShift(
      {
        path: {
          shift_id: shiftId,
        },
        body,
      },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateDeleteVolunteerShift, isPending: isDeleteLoading } =
    useMutation({
      ...deleteCompetitionVolunteersShiftsShiftIdMutation(),
      onSuccess: () => {
        refetchVolunteerShifts();
        toast({
          title: "Créneau supprimé",
          description: "Le créneau a été supprimé avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
    });

  const deleteVolunteerShift = (shiftId: string, callback: () => void) => {
    return mutateDeleteVolunteerShift(
      {
        path: {
          shift_id: shiftId,
        },
      },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateValidation, isPending: isValidating } = useMutation({
    ...patchCompetitionVolunteersShiftsShiftIdUsersUserIdValidationMutation(),
    onSuccess: (_, { body: { validated } }) => {
      refetchVolunteerShifts();
      toast({
        title: validated ? "Participation validée" : "Validation annulée",
        description: validated
          ? "La participation a été confirmée."
          : "La validation a été annulée.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la participation.",
        variant: "destructive",
      });
    },
  });

  const validateParticipation = (
    shiftId: string,
    userId: string,
    validated: boolean,
  ) => {
    return mutateValidation({
      path: {
        shift_id: shiftId,
        user_id: userId,
      },
      body: { validated },
    });
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
