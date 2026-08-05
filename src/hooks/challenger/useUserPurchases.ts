import { useAuth } from "../useAuth";
import { useCompetitionUser } from "./useCompetitionUser";

import { AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase } from "@/api";
import {
  deleteCompetitionPurchasesProductVariantIdMutation,
  getCompetitionPurchasesMeOptions,
  getCompetitionPurchasesUsersUserIdOptions,
  postCompetitionPurchasesMeMutation,
} from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

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
      onSuccess: () => {
        refetchUserPurchases();
        refetchMeCompetition();
        toast({
          title: "Variante ajoutée",
          description: "La variante a été ajoutée avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout de la variante",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
    });

  const createPurchase = (
    body: AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
    callback: () => void,
  ) => {
    return mutateCreatePurchase(
      {
        body,
      },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateDeletePurchase, isPending: isDeletePurchaseLoading } =
    useMutation({
      ...deleteCompetitionPurchasesProductVariantIdMutation(),
      onSuccess: () => {
        refetchUserPurchases();
        refetchMeCompetition();
        toast({
          title: "Variante supprimée",
          description: "La variante a été supprimée avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression de la variante",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
    });

  const deletePurchase = (productVariantId: string, callback: () => void) => {
    return mutateDeletePurchase(
      {
        path: {
          product_variant_id: productVariantId,
        },
      },
      { onSuccess: () => callback() },
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
