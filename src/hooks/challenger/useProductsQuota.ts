import { useAuth } from "../useAuth";

import {
  deleteCompetitionSchoolsSchoolIdProductQuotasProductIdMutation,
  getCompetitionProductsProductIdSchoolsQuotasOptions,
  patchCompetitionSchoolsSchoolIdProductQuotasProductIdMutation,
  postCompetitionSchoolsSchoolIdProductQuotasMutation,
} from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

interface UseProductsQuotaProps {
  productId: string;
}

export const useProductsQuota = ({ productId }: UseProductsQuotaProps) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * A quota is read from two endpoints — by product and by school — so both
   * have to be dropped, whichever side was just written.
   */
  const invalidateProductQuotaQueries = () => {
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) => {
        const id = (queryKey[0] as { _id?: string } | undefined)?._id;
        return (
          id === "getCompetitionProductsProductIdSchoolsQuotas" ||
          id === "getCompetitionSchoolsSchoolIdProductQuotas"
        );
      },
    });
  };

  const {
    data: productsQuota,
    isLoading,
    error,
  } = useQuery({
    ...getCompetitionProductsProductIdSchoolsQuotasOptions({
      path: {
        product_id: productId,
      },
    }),
    enabled: !isTokenExpired() && !!productId,
    retry: false,
    queryHash: "getProductsQuota",
  });

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } = useMutation(
    {
      ...postCompetitionSchoolsSchoolIdProductQuotasMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout du quota",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        invalidateProductQuotaQueries();
        toast({
          title: "Quota ajouté",
          description: "Le quota a été ajouté avec succès.",
        });
      },
    },
  );

  const { mutate: mutateUpdateQuota, isPending: isUpdateLoading } = useMutation(
    {
      ...patchCompetitionSchoolsSchoolIdProductQuotasProductIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la mise à jour du quota",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        invalidateProductQuotaQueries();
        toast({
          title: "Quota mis à jour",
          description: "Le quota a été mis à jour avec succès.",
        });
      },
    },
  );

  const { mutate: mutateDeleteQuota, isPending: isDeleteLoading } = useMutation(
    {
      ...deleteCompetitionSchoolsSchoolIdProductQuotasProductIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression du quota",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        invalidateProductQuotaQueries();
        toast({
          title: "Quota supprimé",
          description: "Le quota a été supprimé avec succès.",
        });
      },
    },
  );

  const createQuota = (
    schoolId: string,
    quota: number,
    onSuccess?: () => void,
  ) => {
    if (isTokenExpired()) return;

    mutateCreateQuota(
      {
        path: { school_id: schoolId },
        body: { product_id: productId, quota },
      },
      {
        onSuccess: () => onSuccess?.(),
      },
    );
  };

  const createQuotaForAllSchools = (
    schoolIds: string[],
    quota: number,
    onSuccess?: () => void,
  ) => {
    if (isTokenExpired()) return;

    const promises = schoolIds.map(
      (schoolId) =>
        new Promise((resolve, reject) => {
          mutateCreateQuota(
            {
              path: { school_id: schoolId },
              body: { product_id: productId, quota },
            },
            {
              onSuccess: resolve,
              onError: reject,
            },
          );
        }),
    );

    Promise.allSettled(promises).then((results) => {
      const successCount = results.filter(
        (r) => r.status === "fulfilled",
      ).length;
      const failureCount = results.filter(
        (r) => r.status === "rejected",
      ).length;

      invalidateProductQuotaQueries();

      if (successCount > 0) {
        toast({
          description: `${successCount} quota(s) créé(s) avec succès${
            failureCount > 0 ? `, ${failureCount} échec(s)` : ""
          }`,
        });
      }
      if (failureCount > 0 && successCount === 0) {
        toast({
          description: "Erreur lors de la création des quotas",
          variant: "destructive",
        });
      }

      onSuccess?.();
    });
  };

  const updateQuota = (
    schoolId: string,
    quota: number,
    onSuccess?: () => void,
  ) => {
    if (isTokenExpired()) return;

    mutateUpdateQuota(
      {
        path: { school_id: schoolId, product_id: productId },
        body: { quota },
      },
      {
        onSuccess: () => onSuccess?.(),
      },
    );
  };

  const deleteQuota = (schoolId: string, onSuccess?: () => void) => {
    if (isTokenExpired()) return;

    mutateDeleteQuota(
      {
        path: { school_id: schoolId, product_id: productId },
      },
      {
        onSuccess: () => onSuccess?.(),
      },
    );
  };

  return {
    productsQuota,
    isLoading,
    error,
    isCreateLoading,
    createQuota,
    createQuotaForAllSchools,
    isUpdateLoading,
    updateQuota,
    isDeleteLoading,
    deleteQuota,
  };
};
