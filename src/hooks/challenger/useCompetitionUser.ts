import { useAuth } from "../useAuth";

import { CompetitionUserBase, CompetitionUserEdit } from "@/api";
import {
  getCompetitionUsersMeOptions,
  patchCompetitionUsersMeMutation,
  postCompetitionUsersMutation,
} from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useCompetitionUser = () => {
  const { token, isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: meCompetition,
    isLoading,
    refetch: refetchMeCompetition,
  } = useQuery({
    ...getCompetitionUsersMeOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  const { mutate: mutateCreateUser, isPending: isCreateLoading } = useMutation({
    ...postCompetitionUsersMutation(),
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de l'ajout de l'utilisateur",
        description:
          (error as unknown as ErrorType)?.stack?.body ||
          (error as unknown as DetailedErrorType)?.stack?.detail ||
          "Une erreur est survenue, veuillez réessayer.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Utilisateur ajouté",
        description: "L'utilisateur a été ajouté avec succès.",
      });
    },
  });

  const createCompetitionUser = async (
    body: CompetitionUserBase,
    callback: () => void,
  ) => {
    return mutateCreateUser(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      },
      {
        onSuccess: () => {
          refetchMeCompetition();
          callback();
        },
      },
    );
  };

  const { mutate: mutateUpdateUserMe, isPending: isUpdateLoading } =
    useMutation({
      ...patchCompetitionUsersMeMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la modification de l'utilisateur",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({
          title: "Utilisateur modifié",
          description: "L'utilisateur a été modifié avec succès.",
        });
      },
    });

  const updateCompetitionUser = async (
    body: CompetitionUserEdit,
    callback: () => void,
  ) => {
    return mutateUpdateUserMe(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      },
      {
        onSuccess: () => {
          refetchMeCompetition();
          callback();
        },
      },
    );
  };

  return {
    meCompetition,
    isLoading,
    refetchMeCompetition,
    createCompetitionUser,
    updateCompetitionUser,
    isCreateLoading,
    isUpdateLoading,
  };
};
