import {
  useDeleteCompetitionUsersUserIdPaymentsPaymentId,
  useGetCompetitionUsersUserIdPayments,
  usePostCompetitionUsersUserIdPayments,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";
import { AppModulesSportCompetitionSchemasSportCompetitionPaymentBase } from "../api/hyperionSchemas";
import { toast } from "../components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "../utils/errorTyping";

export const useUserPayments = () => {
  const { token, isTokenExpired, userId } = useAuth();

  const {
    data: payments,
    isLoading,
    error,
    refetch: refetchPayments,
  } = useGetCompetitionUsersUserIdPayments(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        userId: userId!,
      },
    },
    {
      enabled: !!userId && !isTokenExpired(),
      retry: false,
      queryHash: "getUserPayments",
    },
  );

  const hasPaid = payments && payments.length > 0;

  const { mutateAsync: postPayment, isPending: isPostingPayment } =
    usePostCompetitionUsersUserIdPayments();

  const makePayment = async (
    userId: string,
    body: AppModulesSportCompetitionSchemasSportCompetitionPaymentBase,
  ) => {
    await postPayment({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        userId: userId,
      },
      body: body,
    });
    await refetchPayments();
  };

  const { mutate: mutateDeleteUserPayment, isPending: isDeleteLoading } =
    useDeleteCompetitionUsersUserIdPaymentsPaymentId();

  const deleteUserPayment = (
    userId: string,
    paymentId: string,
    callback: () => void,
  ) => {
    return mutateDeleteUserPayment(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          userId: userId,
          paymentId: paymentId,
        },
      },
      {
        onSettled: (data, error) => {
          if (
            // Exact match for network error message 500
            (error as any).message ===
              "Network error (NetworkError when attempting to fetch resource.)" ||
            (error as any).stack.body ||
            (error as any).stack.detail
          ) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression",
              description:
                (error as any).message ||
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            callback();
            toast({
              title: "Paiement supprimé",
              description: "Le paiement a été supprimé avec succès.",
            });
          }
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
  };
};
