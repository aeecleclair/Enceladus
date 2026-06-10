import { useAuth } from "../useAuth";

import { CompetitionUserEdit } from "@/api";
import {
  deleteCompetitionUsersUserIdMutation,
  getCompetitionUsersOptions,
  patchCompetitionUsersUserIdCancelMutation,
  patchCompetitionUsersUserIdInvalidateMutation,
  patchCompetitionUsersUserIdMutation,
  patchCompetitionUsersUserIdValidateMutation,
} from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useToast } from "@/components/ui/use-toast";

export const useCompetitionUsers = () => {
  const { token, isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: competitionUsers,
    isLoading,
    refetch: refetchCompetitionUsers,
  } = useQuery({
    ...getCompetitionUsersOptions(),
    enabled: !isTokenExpired(),
  });

  const {
    mutate: mutateValidateCompetitionUser,
    isPending: isValidateLoading,
  } = useMutation({
    ...patchCompetitionUsersUserIdValidateMutation(),
    onSuccess: () => {
      refetchCompetitionUsers();
      toast({
        title: "Participant mis à jour",
        description: "Le participant a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la mise à jour",
        description:
          (error as unknown as ErrorType)?.stack?.body ||
          (error as unknown as DetailedErrorType)?.stack?.detail ||
          "Une erreur est survenue, veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const validateCompetitionUser = (userId: string, callback: () => void) => {
    return mutateValidateCompetitionUser(
      { path: { user_id: userId } },
      { onSuccess: () => callback() },
    );
  };

  const {
    mutate: mutateInvalidateCompetitionUser,
    isPending: isInvalidateLoading,
  } = useMutation({
    ...patchCompetitionUsersUserIdInvalidateMutation(),
    onSuccess: () => {
      refetchCompetitionUsers();
      toast({
        title: "Participant mis à jour",
        description: "Le participant a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la mise à jour",
        description:
          (error as unknown as ErrorType)?.stack?.body ||
          (error as unknown as DetailedErrorType)?.stack?.detail ||
          "Une erreur est survenue, veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const invalidateCompetitionUser = (userId: string, callback: () => void) => {
    return mutateInvalidateCompetitionUser(
      { path: { user_id: userId } },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateDeleteCompetitionUser, isPending: isDeleteLoading } =
    useMutation({
      ...deleteCompetitionUsersUserIdMutation(),
      onSuccess: () => {
        refetchCompetitionUsers();
        toast({
          title: "Participant supprimé",
          description: "Le participant a été supprimé avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression",
          description:
            (error as any)?.message ||
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
    });

  const deleteCompetitionUser = (userId: string, callback: () => void) => {
    return mutateDeleteCompetitionUser(
      { path: { user_id: userId } },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateCancelCompetitionUser, isPending: isCancelLoading } =
    useMutation({
      ...patchCompetitionUsersUserIdCancelMutation(),
      onSuccess: () => {
        refetchCompetitionUsers();
        toast({
          title: "Participant désinscrit",
          description: "Le participant a été désinscrit avec succès.",
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
    });

  const cancelCompetitionUser = (userId: string, callback: () => void) => {
    return mutateCancelCompetitionUser(
      { path: { user_id: userId } },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateUpdateCompetitionUser, isPending: isUpdateLoading } =
    useMutation({
      ...patchCompetitionUsersUserIdMutation(),
      onSuccess: () => {
        refetchCompetitionUsers();
        toast({
          title: "Participant mis à jour",
          description: "Le participant a été mis à jour avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la mise à jour",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
    });

  const updateCompetitionUser = (
    userId: string,
    body: CompetitionUserEdit,
    callback: () => void,
  ) => {
    return mutateUpdateCompetitionUser(
      { path: { user_id: userId }, body },
      { onSuccess: () => callback() },
    );
  };

  const volunteers = useMemo(
    () =>
      competitionUsers
        ? competitionUsers.filter(
            (user) =>
              !user.is_athlete &&
              !user.is_pompom &&
              !user.is_fanfare &&
              !user.is_cameraman,
          )
        : [],
    [competitionUsers],
  );

  return {
    competitionUsers,
    volunteers,
    isLoading,
    refetchCompetitionUsers,
    validateCompetitionUser,
    isValidateLoading,
    isInvalidateLoading,
    invalidateCompetitionUser,
    deleteCompetitionUser,
    isDeleteLoading,
    cancelCompetitionUser,
    isCancelLoading,
    updateCompetitionUser,
    isUpdateLoading,
  };
};
