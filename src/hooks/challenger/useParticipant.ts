import { ParticipantInfo } from "@/api";
import {
  deleteCompetitionParticipantsUserIdSportsSportIdMutation,
  deleteCompetitionSportsSportIdWithdrawMutation,
  getCompetitionParticipantsMeOptions,
  postCompetitionSportsSportIdParticipateMutation,
} from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

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

  const { mutateAsync: mutateCreateParticipant, isPending: isCreateLoading } =
    useMutation(postCompetitionSportsSportIdParticipateMutation());

  const createParticipant = async (
    body: ParticipantInfo,
    sportId: string,
    callback: () => unknown,
  ): Promise<boolean> => {
    try {
      await mutateCreateParticipant({
        body,
        path: {
          sport_id: sportId,
        },
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'inscription",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
      return false;
    }
    refetchMeParticipant();
    await callback();
    toast({
      title: "Demande d'inscription enregistrée",
      description: "Votre demande d'inscription a été envoyée avec succès.",
    });
    return true;
  };

  const {
    mutateAsync: mutateWithdrawParticipant,
    isPending: isWithdrawalLoading,
  } = useMutation(deleteCompetitionSportsSportIdWithdrawMutation());

  const withdrawParticipant = async (
    sportId: string,
    callback: () => unknown,
  ): Promise<boolean> => {
    try {
      await mutateWithdrawParticipant({
        path: {
          sport_id: sportId,
        },
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la désinscription",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
      return false;
    }
    await callback();
    toast({
      title: "Désinscription enregistrée",
      description: "Votre désinscription a été effectuée avec succès.",
    });
    return true;
  };

  const { mutateAsync: mutateDeleteParticipant, isPending: isDeletionLoading } =
    useMutation(deleteCompetitionParticipantsUserIdSportsSportIdMutation());

  const deleteParticipant = async (
    sportId: string,
    userId: string,
    callback: () => unknown,
  ): Promise<boolean> => {
    try {
      await mutateDeleteParticipant({
        path: {
          sport_id: sportId,
          user_id: userId,
        },
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la désinscription",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
      return false;
    }
    await callback();
    toast({
      title: "Désinscription enregistrée",
      description: "La désinscription a été effectuée avec succès.",
    });
    return true;
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
