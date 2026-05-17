import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMeParticipant } from "./useMeParticipant";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../useAuth";
import { RaidTeam, RaidTeamBase, RaidTeamUpdate } from "@/api";
import { getRaidParticipantsUserIdTeam } from "@/api/sdk.gen";
import {
  getRaidParticipantsUserIdTeamOptions,
  getRaidParticipantsUserIdTeamQueryKey,
  patchRaidTeamsTeamIdMutation,
  postRaidTeamsMutation,
} from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/raid/errorTyping";

export const useMeTeam = () => {
  const { userId, isTokenExpired } = useAuth();
  const { toast } = useToast();
  const { me } = useMeParticipant();
  const queryClient = useQueryClient();

  const queryKey = userId
    ? getRaidParticipantsUserIdTeamQueryKey({
        path: { user_id: userId },
      })
    : undefined;

  const invalidate = () => {
    if (queryKey) queryClient.invalidateQueries({ queryKey });
  };

  const reportError = (title: string) => (error: unknown) => {
    console.error(error);
    toast({
      title,
      description:
        (error as ErrorType)?.stack?.body ||
        (error as DetailedErrorType)?.stack?.detail ||
        "Une erreur est survenue, veuillez réessayer.",
      variant: "destructive",
    });
  };

  const {
    data: team,
    isLoading,
    refetch: refetchTeam,
  } = useQuery({
    ...getRaidParticipantsUserIdTeamOptions({
      path: { user_id: userId! },
    }),
    queryFn: async ({ signal }) => {
      const { data, error, response } = await getRaidParticipantsUserIdTeam({
        path: { user_id: userId! },
        signal,
      });
      if (response.status === 404) return null as unknown as RaidTeam;
      if (error) throw error;
      return (data ?? null) as unknown as RaidTeam;
    },
    enabled: userId !== null && !isTokenExpired() && !!me,
    retry: 0,
  });

  const {
    mutate: mutateCreateTeam,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
  } = useMutation({
    ...postRaidTeamsMutation(),
    onSuccess: () => {
      toast({ title: "L'équipe a été créée avec succès" });
      invalidate();
    },
    onError: reportError("Erreur lors de la création de l'équipe"),
  });

  const createTeam = (team: RaidTeamBase, callback: () => void) => {
    mutateCreateTeam(
      { body: team },
      { onSuccess: () => callback() },
    );
  };

  const {
    mutate: mutateUpdateTeam,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
  } = useMutation({
    ...patchRaidTeamsTeamIdMutation(),
    onSettled: () => refetchTeam(),
    onError: reportError("Erreur lors de la mise à jour de l'équipe"),
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
