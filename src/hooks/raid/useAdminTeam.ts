import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../useAuth";
import { useHasRaidPermission } from "./useHasRaidPermission";
import {
  deleteRaidTeamsTeamIdMutation,
  getRaidTeamsTeamIdOptions,
  getRaidTeamsTeamIdQueryKey,
  postRaidTeamsTeamIdKickUserIdMutation,
} from "@/api/@tanstack/react-query.gen";
import { useReportError } from "./useReportError";

export const useAdminTeam = (teamId: string) => {
  const { isTokenExpired } = useAuth();
  const { isRaidAdmin } = useHasRaidPermission();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const reportError = useReportError();

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
      toast({ title: "Le membre a été exclu avec succès" });
      queryClient.invalidateQueries({ queryKey: teamQueryKey });
    },
    onError: reportError("Erreur lors de l'exclusion"),
  });

  const { mutate: mutateDeleteTeam, isPending: isDeleteLoading } = useMutation({
    ...deleteRaidTeamsTeamIdMutation(),
    onSuccess: () => {
      toast({ title: "L'équipe a été supprimée avec succès" });
      queryClient.removeQueries({ queryKey: teamQueryKey });
    },
    onError: reportError("Erreur lors de la suppression"),
  });

  const kickMember = (memberUserId: string, callback: () => void) => {
    mutateKickMember(
      { path: { team_id: teamId, user_id: memberUserId } },
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
