import {
  getCompetitionSchoolsSchoolIdProductQuotasOptions,
  patchCompetitionSchoolsSchoolIdProductQuotasProductIdMutation,
  postCompetitionSchoolsSchoolIdProductQuotasMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "../useAuth";
import { useToast } from "@/components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "@/lib/challenger/errorTyping";
import { SchoolProductQuotaBase } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

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
    queryHash: "getSchoolsProductQuota",
  });

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } = useMutation(
    {
      ...postCompetitionSchoolsSchoolIdProductQuotasMutation(),
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
      {
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout du quota",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            refetchSchoolsProductQuota();
            callback();
            toast({
              title: "Quota ajoutée",
              description: "Le quota a été ajouté avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateUpdateQuota, isPending: isUpdateLoading } = useMutation(
    {
      ...patchCompetitionSchoolsSchoolIdProductQuotasProductIdMutation(),
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
      {
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification du quota",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            refetchSchoolsProductQuota();
            callback();
            toast({
              title: "Quota modifiée",
              description: "Le quota a été modifiée avec succès.",
            });
          }
        },
      },
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
  };
};
