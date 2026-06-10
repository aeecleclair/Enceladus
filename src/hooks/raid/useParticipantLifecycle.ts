import {
  getRaidTeamsQueryKey,
  patchRaidParticipantsUserIdCancelMutation,
  patchRaidParticipantsUserIdValidateMutation,
  postRaidParticipantsUserIdReopenMutation,
  postRaidParticipantsUserIdSubmitMutation,
} from "@/api/@tanstack/react-query.gen";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReportError } from "./useReportError";

/**
 * Shared participant lifecycle mutations.
 * Used by participant for self-submit/reopen and by admin for validate/cancel.
 */
export const useParticipantLifecycle = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const reportError = useReportError();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: getRaidTeamsQueryKey() });
    queryClient.invalidateQueries({ queryKey: ["getRaidParticipantsUserId"] });
    queryClient.invalidateQueries({
      queryKey: ["getRaidParticipantsUserIdTeam"],
    });
  };

  const { mutate: mutateSubmit, isPending: isSubmitLoading } = useMutation({
    ...postRaidParticipantsUserIdSubmitMutation(),
    onError: reportError("Erreur lors de la soumission"),
    onSuccess: () => {
      toast({ title: "Inscription soumise" });
      invalidateAll();
    },
  });

  const { mutate: mutateReopen, isPending: isReopenLoading } = useMutation({
    ...postRaidParticipantsUserIdReopenMutation(),
    onError: reportError("Erreur lors de la réouverture"),
    onSuccess: () => {
      toast({ title: "Inscription rouverte" });
      invalidateAll();
    },
  });

  const { mutate: mutateValidate, isPending: isValidateLoading } = useMutation({
    ...patchRaidParticipantsUserIdValidateMutation(),
    onError: reportError("Erreur lors de la validation"),
    onSuccess: () => {
      toast({ title: "Participant validé" });
      invalidateAll();
    },
  });

  const { mutate: mutateCancel, isPending: isCancelLoading } = useMutation({
    ...patchRaidParticipantsUserIdCancelMutation(),
    onError: reportError("Erreur lors de l'annulation"),
    onSuccess: () => {
      toast({ title: "Participant annulé" });
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
