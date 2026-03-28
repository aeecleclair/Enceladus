import {
  usePatchCompetitionMatchesMatchId,
  useDeleteCompetitionMatchesMatchId,
  useGetCompetitionMatchesSportsSportId,
  usePostCompetitionMatchesSportsSportId,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { MatchBase, MatchEdit } from "../api/hyperionSchemas";

interface UseSportMatchesProps {
  sportId?: string;
}

export const useSportMatches = ({ sportId }: UseSportMatchesProps) => {
  const { token, isTokenExpired } = useAuth();

  // Fetch matchs for a specific sport
  const {
    data: sportMatches,
    refetch: refetchSportMatches,
    error,
  } = useGetCompetitionMatchesSportsSportId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        sportId: sportId!,
      },
    },
    {
      enabled: !isTokenExpired() && !!sportId,
      retry: false,
      queryHash: "getSportMatches",
    },
  );

  // Create match for a school in this sport
  const { mutate: mutateCreateMatch, isPending: isCreateLoading } =
    usePostCompetitionMatchesSportsSportId();

  const createMatch = (body: MatchBase, callback: () => void) => {
    return mutateCreateMatch(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          sportId: sportId!,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout du match",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
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

  // Update match for a school in this sport
  const { mutate: mutateUpdateMatch, isPending: isUpdateLoading } =
    usePatchCompetitionMatchesMatchId();

  const updateMatch = (
    matchId: string,
    body: MatchEdit,
    callback: () => void,
  ) => {
    return mutateUpdateMatch(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          matchId: matchId,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification du match",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
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

  // Delete match for a school in this sport
  const { mutate: mutateDeleteMatch, isPending: isDeleteLoading } =
    useDeleteCompetitionMatchesMatchId();

  const deleteMatch = (matchId: string, callback: () => void) => {
    return mutateDeleteMatch(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          matchId: matchId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression du match",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
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
