import {
  useGetCompetitionSports,
  usePatchCompetitionSportsSportId,
  usePostCompetitionSports,
  useDeleteCompetitionSportsSportId,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { SportBase, SportEdit } from "../api/hyperionSchemas";

export const useSports = () => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: sports,
    refetch: refetchSports,
    error,
  } = useGetCompetitionSports(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: false,
      queryHash: "getSports",
    },
  );

  const { mutate: mutateCreateSport, isPending: isCreateLoading } =
    usePostCompetitionSports();

  const createSport = (body: SportBase, callback: () => void) => {
    return mutateCreateSport(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout du sport",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchSports();
            callback();
            toast({
              title: "Sport ajouté",
              description: "Le sport a été ajouté avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateUpdateSport, isPending: isUpdateLoading } =
    usePatchCompetitionSportsSportId();

  const updateSport = (
    sportId: string,
    body: SportEdit,
    callback: () => void,
  ) => {
    return mutateUpdateSport(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
        pathParams: {
          sportId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification du sport",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchSports();
            callback();
            toast({
              title: "Sport modifié",
              description: "Le sport a été modifié avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeleteSport, isPending: isDeleteLoading } =
    useDeleteCompetitionSportsSportId();

  const deleteSport = (sportId: string, callback: () => void) => {
    return mutateDeleteSport(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          sportId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression du sport",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchSports();
            callback();
            toast({
              title: "Sport supprimé",
              description: "Le sport a été supprimé avec succès.",
            });
          }
        },
      },
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
