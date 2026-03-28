import {
  useGetCompetitionSchoolsSchoolIdProductQuotas,
  usePatchCompetitionSchoolsSchoolIdProductQuotasProductId,
  usePostCompetitionSchoolsSchoolIdProductQuotas,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { SchoolProductQuotaBase } from "../api/hyperionSchemas";

interface UseSchoolsProductQuotaProps {
  schoolId?: string;
}

export const useSchoolsProductQuota = ({
  schoolId,
}: UseSchoolsProductQuotaProps) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: schoolsProductQuota,
    refetch: refetchSchoolsProductQuota,
    error,
  } = useGetCompetitionSchoolsSchoolIdProductQuotas(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        schoolId: schoolId!,
      },
    },
    {
      enabled: !isTokenExpired() && !!schoolId,
      retry: false,
      queryHash: "getSchoolsProductQuota",
    },
  );

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } =
    usePostCompetitionSchoolsSchoolIdProductQuotas();

  const createQuota = (body: SchoolProductQuotaBase, callback: () => void) => {
    return mutateCreateQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId!,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout du quota",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
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

  const { mutate: mutateUpdateQuota, isPending: isUpdateLoading } =
    usePatchCompetitionSchoolsSchoolIdProductQuotasProductId();

  const updateQuota = (
    productId: string,
    body: SchoolProductQuotaBase,
    callback: () => void,
  ) => {
    return mutateUpdateQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId!,
          productId,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification du quota",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
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
