import { useAuth } from "../useAuth";
import { useHasRaidPermission } from "./useHasRaidPermission";

import {
  deleteRaidTeamsTeamIdMutation,
  getRaidTeamsTeamIdOptions,
  getRaidTeamsTeamIdQueryKey,
  postRaidTeamsTeamIdKickUserIdMutation,
} from "@/api/@tanstack/react-query.gen";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useAdminTeam = (teamId: string) => {
  const { isTokenExpired } = useAuth();
  const { isRaidAdmin } = useHasRaidPermission();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const teamQueryKey = getRaidTeamsTeamIdQueryKey({
    path: { team_id: teamId },
  });

  const { data: team, refetch: refetchTeam } = useQuery({
    ...getRaidTeamsTeamIdOptions({
      path: { team_id: teamId },
    }),
    retry: 3,
    enabled: isRaidAdmin && !isTokenExpired(),
  });

  const { mutate: mutateKickMember, isPending: isKickLoading } = useMutation({
    ...postRaidTeamsTeamIdKickUserIdMutation(),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Le membre a été exclu avec succès",
      });
      queryClient.invalidateQueries({ queryKey: teamQueryKey });
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

  const { mutate: mutateDeleteTeam, isPending: isDeleteLoading } = useMutation({
    ...deleteRaidTeamsTeamIdMutation(),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "L'équipe a été supprimée avec succès",
      });
      queryClient.removeQueries({ queryKey: teamQueryKey });
    },
  });

  const kickMember = (participantId: string, callback: () => void) => {
    mutateKickMember(
      { path: { team_id: teamId, user_id: participantId } },
      { onSuccess: () => callback() },
    );
  };

  const deleteTeam = (callback: () => void) => {
    mutateDeleteTeam(
      { path: { team_id: teamId } },
      { onSuccess: () => callback() },
    );
  };

  return {
    team,
    refetchTeam,
    kickMember,
    isKickLoading,
    isDeleteLoading,
    deleteTeam,
  };
};
