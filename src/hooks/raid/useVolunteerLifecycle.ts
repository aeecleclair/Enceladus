import {
  getRaidVolunteersQueryKey,
  patchRaidVolunteersUserIdCancelMutation,
  patchRaidVolunteersUserIdValidateMutation,
} from "@/api/@tanstack/react-query.gen";
import { useToast } from "@/components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "@/lib/raid/errorTyping";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Admin-only volunteer lifecycle mutations (validate / cancel).
 * For the volunteer's self-cancel, use useMeVolunteer instead.
 */
export const useVolunteerLifecycle = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getRaidVolunteersQueryKey() });

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

  return {
    validateVolunteer,
    isValidateLoading,
    cancelVolunteer,
    isCancelLoading,
  };
};
