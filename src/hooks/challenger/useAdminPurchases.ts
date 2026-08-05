import {
  AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
  PurchaseEdit,
} from "@/api";
import {
  deleteCompetitionUsersUserIdPurchasesProductVariantIdMutation,
  patchCompetitionPurchasesUsersUserIdVariantsVariantIdMutation,
  postCompetitionPurchasesUsersUserIdMutation,
} from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/challenger/errorTyping";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useAdminPurchases = () => {
  const { toast } = useToast();

  const { mutate: mutateCreatePurchase, isPending: isCreatePurchaseLoading } =
    useMutation({
      ...postCompetitionPurchasesUsersUserIdMutation(),
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Le membre a été exclu avec succès",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'exclusion",
          description: "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
    });

  const createPurchase = (
    userId: string,
    body: AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
    callback: () => void,
  ) => {
    return mutateCreatePurchase(
      {
        path: {
          user_id: userId,
        },
        body,
      },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateEditPurchase, isPending: isEditPurchaseLoading } =
    useMutation({
      ...patchCompetitionPurchasesUsersUserIdVariantsVariantIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la modification de l'achat",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
      onSuccess() {
        toast({
          title: "Achat modifié",
          description: "L'achat a été modifié avec succès.",
        });
      },
    });

  const editPurchase = (
    userId: string,
    variantId: string,
    body: PurchaseEdit,
    callback: () => void,
  ) => {
    return mutateEditPurchase(
      {
        path: {
          user_id: userId,
          variant_id: variantId,
        },
        body,
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateDeletePurchase, isPending: isDeletePurchaseLoading } =
    useMutation({
      ...deleteCompetitionUsersUserIdPurchasesProductVariantIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression de l'achat",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
      onSuccess() {
        toast({
          title: "Achat supprimé",
          description: "L'achat a été supprimé avec succès.",
        });
      },
    });

  const deletePurchase = (
    userId: string,
    productVariantId: string,
    callback: () => void,
  ) => {
    return mutateDeletePurchase(
      {
        path: {
          user_id: userId,
          product_variant_id: productVariantId,
        },
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  return {
    createPurchase,
    isCreatePurchaseLoading,
    editPurchase,
    isEditPurchaseLoading,
    deletePurchase,
    isDeletePurchaseLoading,
  };
};
