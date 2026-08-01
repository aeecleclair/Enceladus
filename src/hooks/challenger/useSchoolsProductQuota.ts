import { useAuth } from "../useAuth";

import { SchoolProductQuotaBase } from "@/api";
import {
  deleteCompetitionSchoolsSchoolIdProductQuotasProductIdMutation,
  getCompetitionSchoolsSchoolIdProductQuotasOptions,
  patchCompetitionSchoolsSchoolIdProductQuotasProductIdMutation,
  postCompetitionSchoolsSchoolIdProductQuotasMutation,
} from "@/api/@tanstack/react-query.gen";
import {
  DetailedErrorType,
  ErrorType,
  getApiErrorMessage,
} from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

interface UseSchoolsProductQuotaProps {
  schoolId?: string;
}

export const useSchoolsProductQuota = ({
  schoolId,
}: UseSchoolsProductQuotaProps) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: schoolsProductQuota,
    refetch: refetchSchoolsProductQuota,
    error,
  } = useQuery({
    ...getCompetitionSchoolsSchoolIdProductQuotasOptions({
      path: {
        school_id: schoolId!,
      },
    }),
    enabled: !isTokenExpired() && !!schoolId,
    retry: false,
    queryHash: `getSchoolsProductQuota-${schoolId}`,
  });

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } = useMutation(
    {
      ...postCompetitionSchoolsSchoolIdProductQuotasMutation(),
      onSuccess: () => {
        refetchSchoolsProductQuota();
        toast({
          title: "Quota ajoutée",
          description: "Le quota a été ajouté avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout du quota",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail,
          variant: "destructive",
        });
      },
    },
  );

  const createQuota = (body: SchoolProductQuotaBase, callback: () => void) => {
    return mutateCreateQuota(
      {
        path: {
          school_id: schoolId!,
        },
        body,
      },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateUpdateQuota, isPending: isUpdateLoading } = useMutation(
    {
      ...patchCompetitionSchoolsSchoolIdProductQuotasProductIdMutation(),
      onSuccess: () => {
        refetchSchoolsProductQuota();
        toast({
          title: "Quota modifiée",
          description: "Le quota a été modifiée avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la modification du quota",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail,
          variant: "destructive",
        });
      },
    },
  );

  const updateQuota = (
    productId: string,
    body: SchoolProductQuotaBase,
    callback: () => void,
  ) => {
    return mutateUpdateQuota(
      {
        path: {
          school_id: schoolId!,
          product_id: productId,
        },
        body,
      },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateDeleteQuota, isPending: isDeleteLoading } = useMutation({
    ...deleteCompetitionSchoolsSchoolIdProductQuotasProductIdMutation(),
    onSuccess: () => {
      refetchSchoolsProductQuota();
      toast({
        title: "Quota supprimé",
        description: "Le quota a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la suppression du quota",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    },
  });

  const deleteQuota = (productId: string, callback: () => void) => {
    return mutateDeleteQuota(
      {
        path: {
          school_id: schoolId!,
          product_id: productId,
        },
      },
      { onSuccess: () => callback() },
    );
  };

  return {
    schoolsProductQuota,
    error,
    refetchSchoolsProductQuota,
    isCreateLoading,
    createQuota,
    isUpdateLoading,
    updateQuota,
    isDeleteLoading,
    deleteQuota,
  };
};
