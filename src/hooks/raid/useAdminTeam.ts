import { useHasRaidPermission } from "./useHasRaidPermission";
import { useReportError } from "./useReportError";

import {
  deleteRaidTeamsTeamIdMutation,
  getRaidTeamsTeamIdOptions,
  getRaidTeamsTeamIdQueryKey,
  postRaidTeamsTeamIdKickUserIdMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useToast } from "@/components/ui/use-toast";

export const useAdminTeam = (teamId: string) => {
  const { isTokenExpired } = useAuth();
  const { isRaidAdmin } = useHasRaidPermission();
  const { toast } = useToast();
  const t = useTranslations("raid.toast");
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
      toast({ title: t("memberKicked") });
      queryClient.invalidateQueries({ queryKey: teamQueryKey });
    },
    onError: reportError(t("kickErrorTitle")),
  });

  const { mutate: mutateDeleteTeam, isPending: isDeleteLoading } = useMutation({
    ...deleteRaidTeamsTeamIdMutation(),
    onSuccess: () => {
      toast({ title: t("teamDeleted") });
      queryClient.removeQueries({ queryKey: teamQueryKey });
    },
    onError: reportError(t("updateErrorTitle")),
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
