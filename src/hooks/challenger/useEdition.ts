import { useAuth } from "../useAuth";

import { CompetitionEditionBase } from "@/api";
import {
  getCompetitionEditionsActiveOptions,
  postCompetitionEditionsEditionIdInscriptionMutation,
  postCompetitionEditionsMutation,
} from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

/**
 * Hook for managing the currently active edition
 * For comprehensive edition management (CRUD operations), use useEditions instead
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
    ...getCompetitionEditionsActiveOptions(),
    enabled: !isTokenExpired(),
    retry: false,
    queryHash: "getEdition",
  });

  const { mutate: mutateCreateEdition, isPending: isCreationLoading } =
    useMutation({
      ...postCompetitionEditionsMutation(),
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
    editionData: CompetitionEditionBase,
    callback: () => void,
  ) => {
    return mutateCreateEdition(
      {
        body: editionData,
      },
      {
        onSuccess: () => {
          refetchEdition();
          callback();
        },
      },
    );
  };

  const { mutate: mutateOpenInscription, isPending: isOpenInscriptionLoading } =
    useMutation({
      ...postCompetitionEditionsEditionIdInscriptionMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ouverture de l'inscription",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Erreur inconnue.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({
          title: "Inscription ouverte",
          description: "L'inscription à l'édition est maintenant ouverte.",
        });
      },
    });

  const openEditionInscription = async (
    editionId: string,
    callback?: () => void,
  ) => {
    mutateOpenInscription(
      {
        path: { edition_id: editionId },
        body: true,
      },
      {
        onSuccess: () => {
          refetchEdition();
          if (callback) callback();
        },
      },
    );
  };

  const {
    mutate: mutateCloseInscription,
    isPending: isCloseInscriptionLoading,
  } = useMutation({
    ...postCompetitionEditionsEditionIdInscriptionMutation(),
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la fermeture de l'inscription",
        description:
          (error as unknown as ErrorType)?.stack?.body ||
          (error as unknown as DetailedErrorType)?.stack?.detail ||
          "Erreur inconnue.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Inscription fermée",
        description: "L'inscription à l'édition est maintenant fermée.",
      });
    },
  });

  const closeEditionInscription = async (
    editionId: string,
    callback?: () => void,
  ) => {
    mutateCloseInscription(
      {
        path: { edition_id: editionId },
        body: false,
      },
      {
        onSuccess: () => {
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
    isCreationLoading,
    createEdition,
    openEditionInscription,
    closeEditionInscription,
    isOpenInscriptionLoading,
    isCloseInscriptionLoading,
  };
};
