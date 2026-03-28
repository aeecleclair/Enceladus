import {
  deleteCompetitionMatchesMatchIdMutation,
  getCompetitionMatchesSportsSportIdOptions,
  patchCompetitionMatchesMatchIdMutation,
  postCompetitionMatchesSportsSportIdMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "../useAuth";
import { useToast } from "@/components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "@/lib/challenger/errorTyping";
import { MatchBase, MatchEdit } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

interface UseSportMatchesProps {
  sportId?: string;
}

export const useSportMatches = ({ sportId }: UseSportMatchesProps) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: sportMatches,
    refetch: refetchSportMatches,
    error,
  } = useQuery({
    ...getCompetitionMatchesSportsSportIdOptions({
      path: {
        sport_id: sportId!,
      },
    }),
    enabled: !isTokenExpired() && !!sportId,
    retry: false,
    queryHash: "getSportMatches",
  });

  const { mutate: mutateCreateMatch, isPending: isCreateLoading } = useMutation(
    {
      ...postCompetitionMatchesSportsSportIdMutation(),
    },
  );

  const createMatch = (body: MatchBase, callback: () => void) => {
    return mutateCreateMatch(
      {
        path: {
          sport_id: sportId!,
        },
        body,
      },
      {
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout du match",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            refetchSportMatches();
            callback();
            toast({
              title: "Match ajoutée",
              description: "Le match a été ajouté avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateUpdateMatch, isPending: isUpdateLoading } = useMutation(
    {
      ...patchCompetitionMatchesMatchIdMutation(),
    },
  );

  const updateMatch = (
    matchId: string,
    body: MatchEdit,
    callback: () => void,
  ) => {
    return mutateUpdateMatch(
      {
        path: {
          match_id: matchId,
        },
        body,
      },
      {
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification du match",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            refetchSportMatches();
            callback();
            toast({
              title: "Match modifiée",
              description: "Le match a été modifiée avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeleteMatch, isPending: isDeleteLoading } = useMutation(
    {
      ...deleteCompetitionMatchesMatchIdMutation(),
    },
  );

  const deleteMatch = (matchId: string, callback: () => void) => {
    return mutateDeleteMatch(
      {
        path: {
          match_id: matchId,
        },
      },
      {
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression du match",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            refetchSportMatches();
            callback();
            toast({
              title: "Match supprimée",
              description: "Le match a été supprimée avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    sportMatches,
    error,
    refetchSportMatches,
    isCreateLoading,
    createMatch,
    isUpdateLoading,
    updateMatch,
    isDeleteLoading,
    deleteMatch,
  };
};
