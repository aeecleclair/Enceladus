import {
  deleteCompetitionPurchasesProductVariantIdMutation,
  getCompetitionPurchasesMeOptions,
  getCompetitionPurchasesUsersUserIdOptions,
  postCompetitionPurchasesMeMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "../useAuth";
import { AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase } from "@/api";
import { useToast } from "@/components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "@/lib/challenger/errorTyping";
import { useCompetitionUser } from "./useCompetitionUser";
import { useMutation, useQuery } from "@tanstack/react-query";

interface UseUserPurchasesProps {
  userId?: string;
}

export const useUserPurchases = ({ userId }: UseUserPurchasesProps) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const { refetchMeCompetition } = useCompetitionUser();

  const {
    data: userPurchases,
    refetch: refetchUserPurchases,
    error,
  } = useQuery({
    ...getCompetitionPurchasesUsersUserIdOptions({
      path: {
        user_id: userId ?? "",
      },
    }),
    enabled: !isTokenExpired() && !!userId,
    retry: false,
    queryHash: "getUserPurchases",
  });

  const { data: userMePurchases, refetch: refetchUserMePurchases } = useQuery({
    ...getCompetitionPurchasesMeOptions(),
    enabled: !isTokenExpired(),
    retry: false,
    queryHash: "getUserMePurchases",
  });

  const { mutate: mutateCreatePurchase, isPending: isCreatePurchaseLoading } =
    useMutation({
      ...postCompetitionPurchasesMeMutation(),
    });

  const createPurchase = (
    body: AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
    callback: () => void,
  ) => {
    return mutateCreatePurchase(
      {
        body,
      },
      {
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout de la variante",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
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
    useMutation({
      ...deleteCompetitionPurchasesProductVariantIdMutation(),
    });

  const deletePurchase = (productVariantId: string, callback: () => void) => {
    return mutateDeletePurchase(
      {
        path: {
          product_variant_id: productVariantId,
        },
      },
      {
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression de la variante",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
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
