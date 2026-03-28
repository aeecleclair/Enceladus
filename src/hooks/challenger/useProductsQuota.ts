import { useToast } from "@/components/ui/use-toast";
import { useGetCompetitionProductsProductIdSchoolsQuotas } from "@/src/api/hyperionComponents";
import { useAuth } from "../useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteCompetitionSchoolsSchoolIdProductQuotasProductIdMutation,
  patchCompetitionSchoolsSchoolIdProductQuotasProductIdMutation,
  postCompetitionSchoolsSchoolIdProductQuotasMutation,
} from "@/api/@tanstack/react-query.gen";

interface UseProductsQuotaProps {
  productId: string;
}

export const useProductsQuota = ({ productId }: UseProductsQuotaProps) => {
  const { token, isTokenExpired } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: productsQuota,
    isLoading,
    error,
  } = useGetCompetitionProductsProductIdSchoolsQuotas(
    {
      pathParams: {
        productId: productId,
      },
    },
    {
      enabled: !isTokenExpired() && !!productId,
      retry: false,
      queryHash: "getProductsQuota",
    },
  );

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } = useMutation(
    {
      ...postCompetitionSchoolsSchoolIdProductQuotasMutation(),
    },
  );

  const { mutate: mutateUpdateQuota, isPending: isUpdateLoading } = useMutation(
    {
      ...patchCompetitionSchoolsSchoolIdProductQuotasProductIdMutation(),
    },
  );

  const { mutate: mutateDeleteQuota, isPending: isDeleteLoading } = useMutation(
    {
      ...deleteCompetitionSchoolsSchoolIdProductQuotasProductIdMutation(),
    },
  );

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["get", "/competition/products/{product_id}/schools_quotas"],
    });
    queryClient.invalidateQueries({
      queryKey: ["get", "/competition/schools/{school_id}/product_quotas"],
    });
  };

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
        onSuccess: () => {
          invalidateQueries();
          toast({ description: "Quota créé avec succès" });
          onSuccess?.();
        },
        onError: (error: any) => {
          console.error("Erreur lors de la création du quota:", error);
          toast({
            description: "Erreur lors de la création du quota",
            variant: "destructive",
          });
        },
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

      invalidateQueries();

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
        onSuccess: () => {
          invalidateQueries();
          toast({ description: "Quota mis à jour avec succès" });
          onSuccess?.();
        },
        onError: (error: any) => {
          console.error("Erreur lors de la mise à jour du quota:", error);
          toast({
            description: "Erreur lors de la mise à jour du quota",
            variant: "destructive",
          });
        },
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
        onSuccess: () => {
          invalidateQueries();
          toast({ description: "Quota supprimé avec succès" });
          onSuccess?.();
        },
        onError: (error: any) => {
          console.error("Erreur lors de la suppression du quota:", error);
          toast({
            description: "Erreur lors de la suppression du quota",
            variant: "destructive",
          });
        },
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
