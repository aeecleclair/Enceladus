import { RaidEditionBase } from "@/api";
import {
  getRaidEditionsActiveOptions,
  patchRaidEditionsEditionIdMutation,
  postRaidEditionsMutation,
} from "@/api/@tanstack/react-query.gen";
import { useToast } from "@/components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "@/lib/raid/errorTyping";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

/**
 * Hook for the currently active raid edition.
 * For comprehensive edition CRUD, use useEditions instead.
 */
export const useEdition = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: edition,
    isLoading,
    refetch: refetchEdition,
    error,
  } = useQuery({
    ...getRaidEditionsActiveOptions(),
    enabled: !isTokenExpired(),
    retry: false,
    queryHash: "getRaidEdition",
  });

  const { mutate: mutateCreateEdition, isPending: isCreationLoading } =
    useMutation({
      ...postRaidEditionsMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la création de l'édition",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({
          title: "Édition créée",
          description: "L'édition a été créée avec succès.",
        });
      },
    });

  const createEdition = async (
    editionData: RaidEditionBase,
    callback: () => void,
  ) => {
    return mutateCreateEdition(
      { body: editionData },
      {
        onSuccess: () => {
          refetchEdition();
          callback();
        },
      },
    );
  };

  const {
    mutate: mutateToggleInscription,
    isPending: isToggleInscriptionLoading,
  } = useMutation({
    ...patchRaidEditionsEditionIdMutation(),
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la mise à jour de l'inscription",
        description:
          (error as unknown as ErrorType)?.stack?.body ||
          (error as unknown as DetailedErrorType)?.stack?.detail ||
          "Erreur inconnue.",
        variant: "destructive",
      });
    },
  });

  const openEditionInscription = (
    editionId: string,
    callback?: () => void,
  ) => {
    mutateToggleInscription(
      {
        path: { edition_id: editionId },
        body: { inscription_enabled: true },
      },
      {
        onSuccess: () => {
          toast({
            title: "Inscription ouverte",
            description: "L'inscription à l'édition est maintenant ouverte.",
          });
          refetchEdition();
          if (callback) callback();
        },
      },
    );
  };

  const closeEditionInscription = (
    editionId: string,
    callback?: () => void,
  ) => {
    mutateToggleInscription(
      {
        path: { edition_id: editionId },
        body: { inscription_enabled: false },
      },
      {
        onSuccess: () => {
          toast({
            title: "Inscription fermée",
            description: "L'inscription à l'édition est maintenant fermée.",
          });
          refetchEdition();
          if (callback) callback();
        },
      },
    );
  };

  return {
    edition,
    error,
    isLoading,
    refetchEdition,
    createEdition,
    isCreationLoading,
    openEditionInscription,
    closeEditionInscription,
    isToggleInscriptionLoading,
  };
};
