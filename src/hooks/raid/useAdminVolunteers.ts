import {
  deleteRaidVolunteersUserIdMutation,
  getRaidVolunteersOptions,
  getRaidVolunteersQueryKey,
  patchRaidVolunteersUserIdCancelMutation,
  patchRaidVolunteersUserIdValidateMutation,
} from "@/api/@tanstack/react-query.gen";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { useHasRaidPermission } from "./useHasRaidPermission";
import { useReportError } from "./useReportError";

/**
 * Admin-only: list all volunteers and perform validate/cancel/delete actions.
 */
export const useAdminVolunteers = () => {
  const { isTokenExpired } = useAuth();
  const { isRaidAdmin } = useHasRaidPermission();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const reportError = useReportError();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getRaidVolunteersQueryKey() });

  const {
    data: volunteers,
    isLoading,
    refetch: refetchVolunteers,
  } = useQuery({
    ...getRaidVolunteersOptions(),
    enabled: !isTokenExpired() && isRaidAdmin,
    retry: false,
  });

  const { mutate: mutateValidate, isPending: isValidateLoading } = useMutation({
    ...patchRaidVolunteersUserIdValidateMutation(),
    onError: reportError("Erreur lors de la validation"),
    onSuccess: () => {
      toast({ title: "Bénévole validé" });
      invalidate();
    },
  });

  const { mutate: mutateCancel, isPending: isCancelLoading } = useMutation({
    ...patchRaidVolunteersUserIdCancelMutation(),
    onError: reportError("Erreur lors de l'annulation"),
    onSuccess: () => {
      toast({ title: "Bénévole annulé" });
      invalidate();
    },
  });

  const { mutate: mutateDelete, isPending: isDeleteLoading } = useMutation({
    ...deleteRaidVolunteersUserIdMutation(),
    onError: reportError("Erreur lors de la suppression"),
    onSuccess: () => {
      toast({ title: "Bénévole supprimé" });
      invalidate();
    },
  });

  const validateVolunteer = (userId: string, callback?: () => void) =>
    mutateValidate(
      { path: { user_id: userId } },
      { onSuccess: () => callback?.() },
    );

  const cancelVolunteer = (userId: string, callback?: () => void) =>
    mutateCancel(
      { path: { user_id: userId } },
      { onSuccess: () => callback?.() },
    );

  const deleteVolunteer = (userId: string, callback?: () => void) =>
    mutateDelete(
      { path: { user_id: userId } },
      { onSuccess: () => callback?.() },
    );

  return {
    volunteers,
    isLoading,
    refetchVolunteers,
    validateVolunteer,
    isValidateLoading,
    cancelVolunteer,
    isCancelLoading,
    deleteVolunteer,
    isDeleteLoading,
  };
};
