import {
  useDeleteCompetitionPurchasesProductVariantId,
  useGetCompetitionPurchasesMe,
  useGetCompetitionPurchasesUsersUserId,
  usePostCompetitionPurchasesMe,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase } from "../api/hyperionSchemas";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { useCompetitionUser } from "./useCompetitionUser";

interface UseUserPurchasesProps {
  userId?: string;
}

export const useUserPurchases = ({ userId }: UseUserPurchasesProps) => {
  const { token, isTokenExpired } = useAuth();
  const { refetchMeCompetition } = useCompetitionUser();

  const {
    data: userPurchases,
    refetch: refetchUserPurchases,
    error,
  } = useGetCompetitionPurchasesUsersUserId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        userId: userId ?? "",
      },
    },
    {
      enabled: !isTokenExpired() && !!userId,
      retry: false,
      queryHash: "getUserPurchases",
    },
  );

  const { data: userMePurchases, refetch: refetchUserMePurchases } =
    useGetCompetitionPurchasesMe(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      {
        enabled: !isTokenExpired(),
        retry: false,
        queryHash: "getUserMePurchases",
      },
    );

  const { mutate: mutateCreatePurchase, isPending: isCreatePurchaseLoading } =
    usePostCompetitionPurchasesMe();

  const createPurchase = (
    body: AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
    callback: () => void,
  ) => {
    return mutateCreatePurchase(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout de la variante",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchUserPurchases();
            refetchMeCompetition();
            callback();
            toast({
              title: "Variante ajoutée",
              description: "La variante a été ajoutée avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeletePurchase, isPending: isDeletePurchaseLoading } =
    useDeleteCompetitionPurchasesProductVariantId();

  const deletePurchase = (productVariantId: string, callback: () => void) => {
    return mutateDeletePurchase(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          productVariantId: productVariantId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression de la variante",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchUserPurchases();
            refetchMeCompetition();
            callback();
            toast({
              title: "Variante supprimée",
              description: "La variante a été supprimée avec succès.",
            });
          }
        },
      },
    );
  };

  const hasPaid = userPurchases?.every((purchase) => purchase.validated);

  return {
    userPurchases,
    userMePurchases,
    hasPaid,
    error,
    refetchUserPurchases,
    refetchUserMePurchases,
    createPurchase,
    isCreatePurchaseLoading,
    deletePurchase,
    isDeletePurchaseLoading,
  };
};
