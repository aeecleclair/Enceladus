import { useMeParticipant } from "./useMeParticipant";
import { useReportError } from "./useReportError";

import { RaidTeamBase, RaidTeamUpdate } from "@/api";
import {
  getRaidParticipantsMeTeamQueryKey,
  patchRaidTeamsTeamIdMutation,
  postRaidTeamsMutation,
} from "@/api/@tanstack/react-query.gen";
import { getRaidParticipantsMeTeam } from "@/api/sdk.gen";
import { useAuth } from "@/app/authContext";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useToast } from "@/components/ui/use-toast";

export const useMeTeam = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const { me } = useMeParticipant();
  const queryClient = useQueryClient();
  const reportError = useReportError();
  const t = useTranslations("raid.toast");

  const queryKey = getRaidParticipantsMeTeamQueryKey({});

  const invalidate = () => {
    if (queryKey) queryClient.invalidateQueries({ queryKey });
  };

  const {
    data: team,
    isLoading,
    refetch: refetchTeam,
  } = useQuery({
    queryKey: getRaidParticipantsMeTeamQueryKey({}),
    queryFn: async ({ signal }) => {
      const { data, error, response } = await getRaidParticipantsMeTeam({
        signal,
      });
      if (response?.status === 404) return null;
      if (error) throw error;
      return data ?? null;
    },
    enabled: !isTokenExpired() && !!me,
    retry: 0,
  });

  const {
    mutate: mutateCreateTeam,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
  } = useMutation({
    ...postRaidTeamsMutation(),
    onSuccess: () => {
      toast({ title: t("teamCreated") });
      invalidate();
    },
    onError: reportError(t("updateErrorTitle")),
  });

  const createTeam = (team: RaidTeamBase, callback: () => void) => {
    mutateCreateTeam({ body: team }, { onSuccess: () => callback() });
  };

  const {
    mutate: mutateUpdateTeam,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
  } = useMutation({
    ...patchRaidTeamsTeamIdMutation(),
    onSettled: () => refetchTeam(),
    onError: reportError(t("updateErrorTitle")),
  });

  const updateTeam = (
    teamId: string,
    callback: () => void,
    team: RaidTeamUpdate,
  ) => {
    mutateUpdateTeam(
      { body: team, path: { team_id: teamId } },
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
