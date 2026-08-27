import {
  AppModulesSportCompetitionSchemasSportCompetitionProductBase,
  AppModulesSportCompetitionSchemasSportCompetitionProductEdit,
  AppModulesSportCompetitionSchemasSportCompetitionProductVariantBase,
  AppModulesSportCompetitionSchemasSportCompetitionProductVariantEdit,
} from "@/api";
import {
  deleteCompetitionProductsProductIdMutation,
  deleteCompetitionProductsVariantsVariantIdMutation,
  getCompetitionProductsOptions,
  patchCompetitionProductsProductIdMutation,
  patchCompetitionProductsVariantsVariantIdMutation,
  postCompetitionProductsMutation,
  postCompetitionProductsProductIdVariantsMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useProducts = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: products,
    refetch: refetchProducts,
    error,
  } = useQuery({
    ...getCompetitionProductsOptions(),
    enabled: !isTokenExpired(),
    retry: false,
    queryHash: "getProducts",
  });

  const { mutate: mutateCreateProduct, isPending: isCreateLoading } =
    useMutation({
      ...postCompetitionProductsMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout du produit",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchProducts();
        toast({
          title: "Produit ajoutée",
          description: "Le produit a été ajouté avec succès.",
        });
      },
    });

  const createProduct = (
    body: AppModulesSportCompetitionSchemasSportCompetitionProductBase,
    callback: () => void,
  ) => {
    return mutateCreateProduct(
      { body },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateUpdateProduct, isPending: isUpdateLoading } =
    useMutation({
      ...patchCompetitionProductsProductIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la modification du produit",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchProducts();
        toast({
          title: "Produit modifiée",
          description: "Le produit a été modifiée avec succès.",
        });
      },
    });

  const updateProduct = (
    productId: string,
    body: AppModulesSportCompetitionSchemasSportCompetitionProductEdit,
    callback: () => void,
  ) => {
    return mutateUpdateProduct(
      {
        path: { product_id: productId },
        body,
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateDeleteProduct, isPending: isDeleteLoading } =
    useMutation({
      ...deleteCompetitionProductsProductIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression du product",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchProducts();
        toast({
          title: "Product supprimée",
          description: "Le product a été supprimée avec succès.",
        });
      },
    });

  const deleteProduct = (productId: string, callback: () => void) => {
    return mutateDeleteProduct(
      { path: { product_id: productId } },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateCreateVariant, isPending: isCreateVariantLoading } =
    useMutation({
      ...postCompetitionProductsProductIdVariantsMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout de la variante",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchProducts();
        toast({
          title: "Variante ajoutée",
          description: "La variante a été ajoutée avec succès.",
        });
      },
    });

  const createVariant = (
    productId: string,
    body: AppModulesSportCompetitionSchemasSportCompetitionProductVariantBase,
    callback: () => void,
  ) => {
    return mutateCreateVariant(
      {
        path: { product_id: productId },
        body,
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateUpdateVariant, isPending: isUpdateVariantLoading } =
    useMutation({
      ...patchCompetitionProductsVariantsVariantIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la modification de la variante",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchProducts();
        toast({
          title: "Variante modifiée",
          description: "La variante a été modifiée avec succès.",
        });
      },
    });

  const updateVariant = (
    variantId: string,
    body: AppModulesSportCompetitionSchemasSportCompetitionProductVariantEdit,
    callback: () => void,
  ) => {
    return mutateUpdateVariant(
      {
        path: { variant_id: variantId },
        body,
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateDeleteVariant, isPending: isDeleteVariantLoading } =
    useMutation({
      ...deleteCompetitionProductsVariantsVariantIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression de la variante",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchProducts();
        toast({
          title: "Variante supprimée",
          description: "La variante a été supprimée avec succès.",
        });
      },
    });

  const deleteVariant = (
    productId: string,
    variantId: string,
    callback: () => void,
  ) => {
    return mutateDeleteVariant(
      {
        path: { variant_id: variantId },
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  return {
    products,
    error,
    refetchProducts,
    isCreateLoading,
    createProduct,
    isUpdateLoading,
    updateProduct,
    isDeleteLoading,
    deleteProduct,
    isCreateVariantLoading,
    createVariant,
    isUpdateVariantLoading,
    updateVariant,
    isDeleteVariantLoading,
    deleteVariant,
  };
};
