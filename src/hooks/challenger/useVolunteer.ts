import { useAuth } from "../useAuth";

import {
  deleteCompetitionVolunteersShiftsShiftIdUnregisterMutation,
  getCompetitionVolunteersMeOptions,
  postCompetitionVolunteersShiftsShiftIdRegisterMutation,
} from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useVolunteer = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: volunteer,
    isLoading,
    refetch: refetchVolunteer,
  } = useQuery({
    ...getCompetitionVolunteersMeOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  const { mutate: mutateRegisterVolunteerShift, isPending: isRegisterLoading } =
    useMutation({
      ...postCompetitionVolunteersShiftsShiftIdRegisterMutation(),
    });

  const {
    mutate: mutateUnregisterVolunteerShift,
    isPending: isUnregisterLoading,
  } = useMutation({
    ...deleteCompetitionVolunteersShiftsShiftIdUnregisterMutation(),
  });

  const registerVolunteerShift = (shiftId: string, callback: () => void) => {
    return mutateRegisterVolunteerShift(
      {
        path: {
          shift_id: shiftId,
        },
      },
      {
        onSuccess: () => {
          callback();
          toast({
            title: "Bénévole assigné",
            description: "Le bénévole a été assigné avec succès.",
          });
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: "Erreur lors de l'assignation du bénévole",
            description:
              (error as unknown as ErrorType)?.stack?.body ||
              (error as unknown as DetailedErrorType)?.stack?.detail ||
              "Une erreur est survenue, veuillez réessayer.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const unregisterVolunteerShift = (shiftId: string, callback: () => void) => {
    return mutateUnregisterVolunteerShift(
      {
        path: {
          shift_id: shiftId,
        },
      },
      {
        onSuccess: () => {
          refetchVolunteer();
          callback();
          toast({
            title: "Désinscription réussie",
            description: "Vous avez été désinscrit du créneau.",
          });
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: "Erreur lors de la désinscription",
            description:
              (error as unknown as ErrorType)?.stack?.body ||
              (error as unknown as DetailedErrorType)?.stack?.detail ||
              "Une erreur est survenue, veuillez réessayer.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    volunteer,
    isLoading,
    refetchVolunteer,
    registerVolunteerShift,
    isRegisterLoading,
    unregisterVolunteerShift,
    isUnregisterLoading,
  };
};
