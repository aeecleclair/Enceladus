import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCompetitionParticipantsMeOptions,
  deleteCompetitionParticipantsUserIdSportsSportIdMutation,
  deleteCompetitionSportsSportIdWithdrawMutation,
  postCompetitionSportsSportIdParticipateMutation,
} from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";
import { ParticipantInfo } from "@/api";

export const useParticipant = () => {
  const { toast } = useToast();

  const {
    data: meParticipant,
    refetch: refetchMeParticipant,
    error,
  } = useQuery({
    ...getCompetitionParticipantsMeOptions(),
    retry: false,
    queryHash: "getMeParticipant",
  });

  const { mutate: mutateCreateParticipant, isPending: isCreateLoading } =
    useMutation({
      ...postCompetitionSportsSportIdParticipateMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'inscription",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchMeParticipant();
        toast({
          title: "Demande d'inscription enregistrée",
          description: "Votre demande d'inscription a été envoyée avec succès.",
        });
      },
    });

  const createParticipant = async (
    body: ParticipantInfo,
    sportId: string,
    callback: () => void,
  ) => {
    return mutateCreateParticipant(
      {
        body,
        path: {
          sport_id: sportId,
        },
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateWithdrawParticipant, isPending: isWithdrawalLoading } =
    useMutation({
      ...deleteCompetitionSportsSportIdWithdrawMutation(),
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
      onSuccess: () => {
        toast({
          title: "Désinscription enregistrée",
          description: "Votre désinscription a été effectuée avec succès.",
        });
      },
    });

  const withdrawParticipant = async (sportId: string, callback: () => void) => {
    return mutateWithdrawParticipant(
      {
        path: {
          sport_id: sportId,
        },
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateDeleteParticipant, isPending: isDeletionLoading } =
    useMutation({
      ...deleteCompetitionParticipantsUserIdSportsSportIdMutation(),
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
      onSuccess: () => {
        toast({
          title: "Désinscription enregistrée",
          description: "La désinscription a été effectuée avec succès.",
        });
      },
    });

  const deleteParticipant = async (
    sportId: string,
    userId: string,
    callback: () => void,
  ) => {
    return mutateDeleteParticipant(
      {
        path: {
          sport_id: sportId,
          user_id: userId,
        },
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  return {
    meParticipant,
    refetchMeParticipant,
    error,
    createParticipant,
    isCreateLoading,
    withdrawParticipant,
    isWithdrawalLoading,
    deleteParticipant,
    isDeletionLoading,
  };
};
