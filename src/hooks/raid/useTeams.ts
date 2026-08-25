import { useHasRaidPermission } from "./useHasRaidPermission";

import {
  deleteRaidTeamsMutation,
  getRaidTeamsOptions,
  getRaidTeamsQueryKey,
  postRaidTeamsMergeMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useTeams = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const { isRaidAdmin } = useHasRaidPermission();

  const queryClient = useQueryClient();
  const teamsQueryKey = getRaidTeamsQueryKey({});

  const {
    data: teams,
    isLoading,
    refetch: refetchTeams,
  } = useQuery({
    ...getRaidTeamsOptions({}),
    retry: 3,
    enabled: isRaidAdmin && !isTokenExpired(),
  });

  const { mutate: mutateDeleteAllTeams, isPending: isDeletionLoading } =
    useMutation({
      ...deleteRaidTeamsMutation(),
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Toutes les équipes ont été supprimées avec succès",
        });
        queryClient.invalidateQueries({ queryKey: teamsQueryKey });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'exclusion",
          description: "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
    });

  const deleteAllTeams = (callback: () => void) => {
    mutateDeleteAllTeams({}, { onSuccess: () => callback() });
  };

  const { mutate: mutateMergeTeams, isPending: isMergeLoading } = useMutation({
    ...postRaidTeamsMergeMutation(),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Les équipes ont été fusionnées avec succès",
      });
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la fusion des équipes",
        description: "Une erreur est survenue, veuillez réessayer plus tard",
        variant: "destructive",
      });
    },
  });

  const mergeTeams = (
    team1Id: string,
    team2Id: string,
    callback: () => void,
  ) => {
    mutateMergeTeams(
      {
        query: {
          team1_id: team1Id,
          team2_id: team2Id,
        },
      },
      { onSuccess: () => callback() },
    );
  };

  return {
    teams,
    isLoading,
    refetchTeams,
    deleteAllTeams,
    isDeletionLoading,
    mergeTeams,
    isMergeLoading,
  };
};
