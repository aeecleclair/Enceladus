import { MatchBase, MatchEdit } from "@/api";
import {
  deleteCompetitionMatchesMatchIdMutation,
  getCompetitionMatchesSportsSportIdOptions,
  patchCompetitionMatchesMatchIdMutation,
  postCompetitionMatchesSportsSportIdMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

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
      onSuccess: () => {
        refetchSportMatches();
        toast({
          title: "Match ajoutée",
          description: "Le match a été ajouté avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout du match",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail,
          variant: "destructive",
        });
      },
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
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateUpdateMatch, isPending: isUpdateLoading } = useMutation(
    {
      ...patchCompetitionMatchesMatchIdMutation(),
      onSuccess: () => {
        refetchSportMatches();
        toast({
          title: "Match modifiée",
          description: "Le match a été modifiée avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la modification du match",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail,
          variant: "destructive",
        });
      },
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
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateDeleteMatch, isPending: isDeleteLoading } = useMutation(
    {
      ...deleteCompetitionMatchesMatchIdMutation(),
      onSuccess: () => {
        refetchSportMatches();
        toast({
          title: "Match supprimée",
          description: "Le match a été supprimée avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression du match",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail,
          variant: "destructive",
        });
      },
    },
  );

  const deleteMatch = (matchId: string, callback: () => void) => {
    return mutateDeleteMatch(
      {
        path: {
          match_id: matchId,
        },
      },
      { onSuccess: () => callback() },
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
