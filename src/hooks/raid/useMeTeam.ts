import { useAuth } from "../useAuth";
import { useHasRaidPermission } from "./useHasRaidPermission";
import { useMeParticipant } from "./useMeParticipant";

import { RaidTeamBase, RaidTeamUpdate } from "@/api";
import {
  getRaidParticipantsUserIdTeamOptions,
  getRaidParticipantsUserIdTeamQueryKey,
  patchRaidTeamsTeamIdMutation,
  postRaidTeamsMutation,
} from "@/api/@tanstack/react-query.gen";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useMeTeam = () => {
  const { userId, isTokenExpired } = useAuth();
  const { toast } = useToast();
  const { me } = useMeParticipant();
  const { isRaidAdmin } = useHasRaidPermission();
  const queryClient = useQueryClient();

  const queryKey = getRaidParticipantsUserIdTeamQueryKey({
    path: {
      user_id: userId!,
    },
  });

  const {
    data: team,
    isLoading,
    refetch: refetchTeam,
  } = useQuery({
    ...getRaidParticipantsUserIdTeamOptions({
      path: {
        user_id: userId!,
      },
    }),
    enabled:
      userId !== null && !isRaidAdmin && !isTokenExpired() && me !== undefined,
    retry: 0,
  });

  const {
    mutate: mutateCreateTeam,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
  } = useMutation({
    ...postRaidTeamsMutation(),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "L'équipe a été créée avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
    onError: () => {
      toast({
        title: "Erreur lors de la création de l'équipe",
        description: "Une erreur est survenue, veuillez réessayer plus tard",
        variant: "destructive",
      });
    },
  });

  const createTeam = (team: RaidTeamBase, callback: () => void) => {
    mutateCreateTeam(
      {
        body: team,
      },
      { onSuccess: () => callback() },
    );
  };

  const {
    mutate: mutateUpdateTeam,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
  } = useMutation({
    ...patchRaidTeamsTeamIdMutation(),
    onSettled: () => {
      refetchTeam();
    },
  });

  const updateTeam = (
    teamId: string,
    callback: () => void,
    team: RaidTeamUpdate,
  ) => {
    mutateUpdateTeam(
      {
        body: team,
        path: {
          team_id: teamId,
        },
      },
      { onSuccess: () => callback() },
    );
  };

  return {
    team,
    isLoading,
    createTeam,
    isCreationLoading,
    isCreationSuccess,
    refetchTeam,
    updateTeam,
    isUpdateLoading,
    isUpdateSuccess,
  };
};
