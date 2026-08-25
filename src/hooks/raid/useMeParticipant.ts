import { useReportError } from "./useReportError";

import { RaidParticipant, RaidParticipantUpdate } from "@/api";
import {
  getRaidParticipantsUserIdOptions,
  getRaidParticipantsUserIdQueryKey,
  patchRaidParticipantsUserIdMutation,
  postRaidParticipantsMutation,
} from "@/api/@tanstack/react-query.gen";
import { getRaidParticipantsUserId } from "@/api/sdk.gen";
import { useAuth } from "@/app/authContext";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useMeParticipant = () => {
  const { userId, isTokenExpired } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const reportError = useReportError();

  const participantsQueryKey = userId
    ? getRaidParticipantsUserIdQueryKey({ path: { user_id: userId } })
    : undefined;

  const invalidate = () => {
    if (participantsQueryKey) {
      queryClient.invalidateQueries({ queryKey: participantsQueryKey });
    }
  };

  const {
    data: me,
    isLoading,
    isFetched,
    refetch,
  } = useQuery({
    ...getRaidParticipantsUserIdOptions({
      path: { user_id: userId! },
    }),
    // Treat 404 as "no participant yet" (null) instead of an error. Errored
    // queries bypass staleTime and refetch on every remount, which floods the
    // backend when many components observe this hook on first paint.
    queryFn: async ({ signal }) => {
      const { data, error, response } = await getRaidParticipantsUserId({
        path: { user_id: userId! },
        signal,
      });
      if (response?.status === 404) return null as unknown as RaidParticipant;
      if (error) throw error;
      return (data ?? null) as unknown as RaidParticipant;
    },
    enabled: userId !== null && !isTokenExpired(),
    retry: 0,
  });

  const {
    mutate: mutateCreateParticipant,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
  } = useMutation({
    ...postRaidParticipantsMutation(),
    onSuccess: () => {
      toast({ title: "Inscription créée" });
      invalidate();
    },
    onError: reportError("Erreur lors de la création du participant"),
  });

  const createParticipant = (callback: () => void) => {
    mutateCreateParticipant(undefined as never, {
      onSuccess: () => callback(),
    });
  };

  const {
    mutate: mutateUpdateParticipant,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
  } = useMutation({
    ...patchRaidParticipantsUserIdMutation(),
    onSuccess: () => {
      toast({ title: "Participant mis à jour" });
      invalidate();
    },
    onError: reportError("Erreur lors de la mise à jour du participant"),
  });

  const updateParticipant = (
    participant: RaidParticipantUpdate,
    participantUserId: string,
    callback: () => void,
  ) => {
    mutateUpdateParticipant(
      { body: participant, path: { user_id: participantUserId } },
      {
        onSuccess: () => {
          refetch();
          callback();
        },
      },
    );
  };

  return {
    me,
    isLoading,
    isFetched,
    refetch,
    createParticipant,
    isCreationSuccess,
    isCreationLoading,
    updateParticipant,
    isUpdateSuccess,
    isUpdateLoading,
  };
};
