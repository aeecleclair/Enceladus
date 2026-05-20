import {
  deleteCompetitionVolunteersShiftsShiftIdUnregisterMutation,
  getCompetitionVolunteersMeOptions,
  postCompetitionVolunteersShiftsShiftIdRegisterMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "../useAuth";
import { useToast } from "@/components/ui/use-toast";
import { DetailedErrorType } from "@/lib/challenger/errorTyping";
import { useMutation, useQuery } from "@tanstack/react-query";

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
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'assignation du bénévole",
              description:
                (error as any)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            callback();
            toast({
              title: "Bénévole assigné",
              description: "Le bénévole a été assigné avec succès.",
            });
          }
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
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la désinscription",
              description:
                (error as any)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            refetchVolunteer();
            callback();
            toast({
              title: "Désinscription réussie",
              description: "Vous avez été désinscrit du créneau.",
            });
          }
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
