import { useReportError } from "./useReportError";

import {
  patchRaidParticipantsUserIdCancelMutation,
  patchRaidParticipantsUserIdValidateMutation,
  postRaidParticipantsUserIdReopenMutation,
  postRaidParticipantsUserIdSubmitMutation,
} from "@/api/@tanstack/react-query.gen";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useToast } from "@/components/ui/use-toast";

const isRaidLifecycleQuery = (query: { queryKey: readonly unknown[] }) => {
  const id = (query.queryKey[0] as { _id?: string } | undefined)?._id;
  return (
    id === "getRaidTeams" ||
    id === "getRaidTeamsTeamId" ||
    id === "getRaidParticipants" ||
    id === "getRaidParticipantsMe" ||
    id === "getRaidParticipantsMeTeam" ||
    id === "getRaidParticipantsUserId" ||
    id === "getRaidParticipantsUserIdTeam"
  );
};

/**
 * Shared participant lifecycle mutations.
 * Used by participant for self-submit/reopen and by admin for validate/cancel.
 */
export const useParticipantLifecycle = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const reportError = useReportError();
  const t = useTranslations("raid.toast");

  const invalidateAll = () => {
    queryClient.invalidateQueries({
      predicate: isRaidLifecycleQuery,
    });
  };

  const { mutate: mutateSubmit, isPending: isSubmitLoading } = useMutation({
    ...postRaidParticipantsUserIdSubmitMutation(),
    onError: reportError(t("updateErrorTitle")),
    onSuccess: () => {
      toast({ title: t("registrationSubmitted") });
      invalidateAll();
    },
  });

  const { mutate: mutateReopen, isPending: isReopenLoading } = useMutation({
    ...postRaidParticipantsUserIdReopenMutation(),
    onError: reportError(t("updateErrorTitle")),
    onSuccess: () => {
      toast({ title: t("registrationReopened") });
      invalidateAll();
    },
  });

  const { mutate: mutateValidate, isPending: isValidateLoading } = useMutation({
    ...patchRaidParticipantsUserIdValidateMutation(),
    onError: reportError(t("validationErrorTitle")),
    onSuccess: () => {
      toast({ title: t("participantValidated") });
      invalidateAll();
    },
  });

  const { mutate: mutateCancel, isPending: isCancelLoading } = useMutation({
    ...patchRaidParticipantsUserIdCancelMutation(),
    onError: reportError(t("volunteerCancelErrorTitle")),
    onSuccess: () => {
      toast({ title: t("participantCancelled") });
      invalidateAll();
    },
  });

  const submitParticipant = (userId: string, callback?: () => void) =>
    mutateSubmit(
      { path: { user_id: userId } },
      { onSuccess: () => callback?.() },
    );

  const reopenParticipant = (userId: string, callback?: () => void) =>
    mutateReopen(
      { path: { user_id: userId } },
      { onSuccess: () => callback?.() },
    );

  const validateParticipant = (userId: string, callback?: () => void) =>
    mutateValidate(
      { path: { user_id: userId } },
      { onSuccess: () => callback?.() },
    );

  const cancelParticipant = (userId: string, callback?: () => void) =>
    mutateCancel(
      { path: { user_id: userId } },
      { onSuccess: () => callback?.() },
    );

  return {
    submitParticipant,
    isSubmitLoading,
    reopenParticipant,
    isReopenLoading,
    validateParticipant,
    isValidateLoading,
    cancelParticipant,
    isCancelLoading,
  };
};
