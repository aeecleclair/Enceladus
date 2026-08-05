import { useAuth } from "../useAuth";

import { SchoolResult } from "@/api";
import { getCompetitionPodiumsPompomsOptions } from "@/api/@tanstack/react-query.gen";
import {
  deleteCompetitionPodiumsPompomsMutation,
  postCompetitionPodiumsPompomsMutation,
} from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const usePompomsPodiums = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  // Get pompoms podium
  const {
    data: pompomsResults,
    isLoading: isPompomsLoading,
    refetch: refetchPompomsPodium,
    error: pompomsError,
  } = useQuery({
    ...getCompetitionPodiumsPompomsOptions(),
    enabled: !isTokenExpired(),
    retry: false,
    queryHash: "getPompomsPodium",
  });

  const {
    mutate: mutateCreateOrUpdatePompomsPodium,
    isPending: isUpdateLoading,
  } = useMutation({
    ...postCompetitionPodiumsPompomsMutation(),
    onError: (error) => {
      console.log(error);
      toast({
        title: "Erreur lors de la mise à jour du podium pompoms",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    },
    onSuccess: () => {
      refetchPompomsPodium();
      toast({
        title: "Podium pompoms mis à jour",
        description: "Le podium pompoms a été mis à jour avec succès.",
      });
    },
  });

  const createOrUpdatePompomsPodium = (
    rankings: SchoolResult[],
    callback: () => void,
  ) => {
    return mutateCreateOrUpdatePompomsPodium(
      { body: rankings },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateDeletePompomsPodium, isPending: isDeleteLoading } =
    useMutation({
      ...deleteCompetitionPodiumsPompomsMutation(),
      onError: (error) => {
        console.log(error);
        toast({
          title: "Erreur lors de la suppression du podium pompoms",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchPompomsPodium();
        toast({
          title: "Podium pompoms supprimé",
          description: "Le podium pompoms a été supprimé avec succès.",
        });
      },
    });

  const deletePompomsPodium = (callback: () => void) => {
    return mutateDeletePompomsPodium(
      {},
      {
        onSuccess: () => callback(),
      },
    );
  };

  return {
    pompomsResults,
    createOrUpdatePompomsPodium,
    deletePompomsPodium,
    isPompomsLoading,
    isUpdateLoading,
    isDeleteLoading,
    pompomsError,
    refetchPompomsPodium,
  };
};
