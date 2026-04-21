import {
  getCompetitionEditionsActiveOptions,
  getCompetitionEditionsOptions,
  patchCompetitionEditionsEditionIdMutation,
  postCompetitionEditionsEditionIdActivateMutation,
  postCompetitionEditionsMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "../useAuth";
import { useToast } from "@/components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CompetitionEdition,
  CompetitionEditionBase,
  CompetitionEditionEdit,
} from "@/api";

export const useEditions = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  // Get all editions
  const {
    data: editions,
    isLoading: editionsLoading,
    refetch: refetchEditions,
    error: editionsError,
  } = useQuery({
    ...getCompetitionEditionsOptions(),
    enabled: !isTokenExpired(),
    retry: false,
    queryHash: "getEditions",
  });

  // Get active edition
  const {
    data: activeEdition,
    isLoading: activeLoading,
    refetch: refetchActiveEdition,
    error: activeEditionError,
  } = useQuery({
    ...getCompetitionEditionsActiveOptions(),
    enabled: !isTokenExpired(),
    retry: false,
    queryHash: "getActiveEdition",
  });

  // Create edition mutation
  const { mutate: mutateCreateEdition, isPending: isCreateLoading } =
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
      onSuccess() {
        refetchEditions();
        refetchActiveEdition();
        toast({
          title: "Édition créée",
          description: "L'édition a été créée avec succès.",
        });
      },
    });

  const createEdition = (
    body: CompetitionEditionBase,
    callback: () => void,
  ) => {
    return mutateCreateEdition(
      {
        body: body,
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  // Update edition mutation
  const { mutate: mutateUpdateEdition, isPending: isUpdateLoading } =
    useMutation({
      ...patchCompetitionEditionsEditionIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la modification de l'édition",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess() {
        refetchEditions();
        refetchActiveEdition();
        toast({
          title: "Édition modifiée",
          description: "L'édition a été modifiée avec succès.",
        });
      },
    });

  const updateEdition = (
    editionId: string,
    body: CompetitionEditionEdit,
    callback: () => void,
  ) => {
    return mutateUpdateEdition(
      {
        body: body,
        path: { edition_id: editionId },
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  // Activate edition mutation
  const { mutate: mutateActivateEdition, isPending: isActivateLoading } =
    useMutation({
      ...postCompetitionEditionsEditionIdActivateMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'activation de l'édition",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess() {
        refetchEditions();
        refetchActiveEdition();
        toast({
          title: "Édition activée",
          description: "L'édition a été activée avec succès.",
        });
      },
    });

  const activateEdition = (editionId: string, callback: () => void) => {
    return mutateActivateEdition(
      {
        path: { edition_id: editionId },
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  // Helper functions
  const getEditionStatus = (edition: CompetitionEdition) => {
    const now = new Date();
    const startDate = new Date(edition.start_date);
    const endDate = new Date(edition.end_date);

    if (edition.active) {
      if (now < startDate)
        return { status: "À venir", variant: "secondary" as const };
      if (now > endDate)
        return { status: "Terminée", variant: "destructive" as const };
      return { status: "En cours", variant: "default" as const };
    }
    return { status: "Inactive", variant: "outline" as const };
  };

  const isLoading = editionsLoading || activeLoading;
  const error = editionsError || activeEditionError;

  return {
    // Data
    editions,
    activeEdition,

    // Loading states
    isLoading,
    editionsLoading,
    activeLoading,
    isCreateLoading,
    isUpdateLoading,
    isActivateLoading,

    // Errors
    error,
    editionsError,
    activeEditionError,

    // Actions
    createEdition,
    updateEdition,
    activateEdition,
    refetchEditions,
    refetchActiveEdition,

    // Helpers
    getEditionStatus,
  };
};
