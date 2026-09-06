import { useReportError } from "./useReportError";

import { RaidParticipantUpdate } from "@/api";
import type { RaidParticipantRestrictedComplete } from "@/api";
import {
  getRaidParticipantsUserIdQueryKey,
  patchRaidParticipantsUserIdMutation,
} from "@/api/@tanstack/react-query.gen";
import { getRaidParticipantsUserId } from "@/api/sdk.gen";
import { useAuth } from "@/app/authContext";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useParticipant = (userId: string) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const reportError = useReportError();

  const participantQueryKey = getRaidParticipantsUserIdQueryKey({
    path: { user_id: userId },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: participantQueryKey });
  };

  const {
    data: participant,
    isLoading,
    isFetched,
    refetch,
  } = useQuery<RaidParticipantRestrictedComplete | null>({
    queryKey: participantQueryKey,
    // Treat 404 as "no participant yet" (null) instead of an error. Errored
    // queries bypass staleTime and refetch on every remount, which floods the
    // backend when many components observe this hook on first paint.
    queryFn: async ({ signal }) => {
      const { data, error, response } = await getRaidParticipantsUserId({
        path: { user_id: userId },
        signal,
      });
      if (response?.status === 404) return null;
      if (error) throw error;
      return data ?? null;
    },
    enabled: !isTokenExpired(),
    retry: 0,
  });

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
    callback: () => void,
  ) => {
    mutateUpdateParticipant(
      { body: participant, path: { user_id: userId } },
      {
        onSuccess: () => {
          refetch();
          callback();
        },
      },
    );
  };

  return {
    participant,
    isLoading,
    isFetched,
    refetch,
    updateParticipant,
    isUpdateSuccess,
    isUpdateLoading,
  };
};
