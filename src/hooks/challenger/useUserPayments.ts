import { useAuth } from "../useAuth";

import { AppModulesSportCompetitionSchemasSportCompetitionPaymentBase } from "@/api";
import {
  deleteCompetitionUsersUserIdPaymentsPaymentIdMutation,
  getCompetitionUsersUserIdPaymentsOptions,
  postCompetitionUsersUserIdPaymentsMutation,
} from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useUserPayments = () => {
  const { isTokenExpired, userId } = useAuth();
  const { toast } = useToast();

  const {
    data: payments,
    isLoading,
    error,
    refetch: refetchPayments,
  } = useQuery({
    ...getCompetitionUsersUserIdPaymentsOptions({
      path: {
        user_id: userId!,
      },
    }),
    enabled: !!userId && !isTokenExpired(),
    retry: false,
    queryHash: "getUserPayments",
  });

  const hasPaid = payments && payments.length > 0;

  const { mutateAsync: postPayment, isPending: isPostingPayment } = useMutation(
    {
      ...postCompetitionUsersUserIdPaymentsMutation(),
    },
  );

  const makePayment = async (
    targetUserId: string,
    body: AppModulesSportCompetitionSchemasSportCompetitionPaymentBase,
  ) => {
    await postPayment({
      path: {
        user_id: targetUserId,
      },
      body,
    });
    await refetchPayments();
  };

  const { mutate: mutateDeleteUserPayment, isPending: isDeleteLoading } =
    useMutation({
      ...deleteCompetitionUsersUserIdPaymentsPaymentIdMutation(),
    });

  const deleteUserPayment = (
    targetUserId: string,
    paymentId: string,
    callback: () => void,
  ) => {
    return mutateDeleteUserPayment(
      {
        path: {
          user_id: targetUserId,
          payment_id: paymentId,
        },
      },
      {
        onSuccess: () => {
          callback();
          toast({
            title: "Paiement supprimé",
            description: "Le paiement a été supprimé avec succès.",
          });
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: "Erreur lors de la suppression",
            description:
              (error as unknown as ErrorType)?.stack?.body ||
              (error as unknown as DetailedErrorType)?.stack?.detail ||
              "Une erreur est survenue, veuillez réessayer.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    payments,
    hasPaid,
    isLoading,
    error,
    refetchPayments,
    makePayment,
    deleteUserPayment,
    isPostingPayment,
    isDeleteLoading,
  };
};
