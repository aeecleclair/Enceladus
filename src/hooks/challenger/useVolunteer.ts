import { useAuth } from "./useAuth";
import {
  useGetCompetitionVolunteersMe,
  usePostCompetitionVolunteersShiftsShiftIdRegister,
  useDeleteCompetitionVolunteersShiftsShiftIdUnregister,
} from "../api/hyperionComponents";
import { toast } from "../components/ui/use-toast";
import { DetailedErrorType } from "../utils/errorTyping";

export const useVolunteer = () => {
  const { token, isTokenExpired } = useAuth();
  const {
    data: volunteer,
    isLoading,
    refetch: refetchVolunteer,
  } = useGetCompetitionVolunteersMe(
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

  const { mutate: mutateRegisterVolunteerShift, isPending: isRegisterLoading } =
    usePostCompetitionVolunteersShiftsShiftIdRegister();

  const {
    mutate: mutateUnregisterVolunteerShift,
    isPending: isUnregisterLoading,
  } = useDeleteCompetitionVolunteersShiftsShiftIdUnregister();

  const registerVolunteerShift = (shiftId: string, callback: () => void) => {
    return mutateRegisterVolunteerShift(
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
              title: "Erreur lors de l'assignation du bénévole",
              description:
                (error as any).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          shiftId: shiftId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack?.body || (error as any).stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la désinscription",
              description:
                (error as any).stack?.body ||
                (error as unknown as DetailedErrorType).stack?.detail,
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
