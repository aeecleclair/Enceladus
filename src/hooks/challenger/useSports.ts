import { SportBase, SportEdit } from "@/api";
import {
  deleteCompetitionSportsSportIdMutation,
  getCompetitionSportsOptions,
  patchCompetitionSportsSportIdMutation,
  postCompetitionSportsMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useSports = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: sports,
    refetch: refetchSports,
    error,
  } = useQuery({
    ...getCompetitionSportsOptions(),
    enabled: !isTokenExpired(),
    retry: false,
    queryHash: "getSports",
  });

  const { mutate: mutateCreateSport, isPending: isCreateLoading } = useMutation(
    {
      ...postCompetitionSportsMutation(),
      onSuccess: () => {
        refetchSports();
        toast({
          title: "Sport ajouté",
          description: "Le sport a été ajouté avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout du sport",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail,
          variant: "destructive",
        });
      },
    },
  );

  const createSport = (body: SportBase, callback: () => void) => {
    return mutateCreateSport(
      {
        body,
      },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateUpdateSport, isPending: isUpdateLoading } = useMutation(
    {
      ...patchCompetitionSportsSportIdMutation(),
      onSuccess: () => {
        refetchSports();
        toast({
          title: "Sport modifié",
          description: "Le sport a été modifié avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la modification du sport",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail,
          variant: "destructive",
        });
      },
    },
  );

  const updateSport = (
    sportId: string,
    body: SportEdit,
    callback: () => void,
  ) => {
    return mutateUpdateSport(
      {
        body,
        path: {
          sport_id: sportId,
        },
      },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateDeleteSport, isPending: isDeleteLoading } = useMutation(
    {
      ...deleteCompetitionSportsSportIdMutation(),
      onSuccess: () => {
        refetchSports();
        toast({
          title: "Sport supprimé",
          description: "Le sport a été supprimé avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression du sport",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail,
          variant: "destructive",
        });
      },
    },
  );

  const deleteSport = (sportId: string, callback: () => void) => {
    return mutateDeleteSport(
      {
        path: {
          sport_id: sportId,
        },
      },
      { onSuccess: () => callback() },
    );
  };

  return {
    sports,
    createSport,
    error,
    isCreateLoading,
    isUpdateLoading,
    updateSport,
    deleteSport,
    isDeleteLoading,
    refetchSports,
  };
};
