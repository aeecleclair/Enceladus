import { useReportError } from "./useReportError";

import { RaidParticipant, RaidParticipantUpdate } from "@/api";
import {
  getRaidParticipantsMeQueryKey,
  patchRaidParticipantsUserIdMutation,
  postRaidParticipantsMutation,
} from "@/api/@tanstack/react-query.gen";
import { getRaidParticipantsMe } from "@/api/sdk.gen";
import { useAuth } from "@/app/authContext";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useToast } from "@/components/ui/use-toast";

export const useMeParticipant = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const reportError = useReportError();
  const t = useTranslations("raid.toast");

  const participantsQueryKey = getRaidParticipantsMeQueryKey({});

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
  } = useQuery<RaidParticipant | null>({
    queryKey: getRaidParticipantsMeQueryKey({}),
    // Treat 404 as "no participant yet" (null) instead of an error. Errored
    // queries bypass staleTime and refetch on every remount, which floods the
    // backend when many components observe this hook on first paint.
    queryFn: async ({ signal }) => {
      const { data, error, response } = await getRaidParticipantsMe({
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
    mutate: mutateCreateParticipant,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
  } = useMutation({
    ...postRaidParticipantsMutation(),
    onSuccess: () => {
      toast({ title: t("registrationCreated") });
      invalidate();
    },
    onError: reportError(t("updateErrorTitle")),
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
      toast({ title: t("participantUpdated") });
      invalidate();
    },
    onError: reportError(t("participantUpdateErrorTitle")),
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
