import {
  useDeleteCompetitionSchoolsSchoolIdSportsSportIdQuotas,
  useGetCompetitionSchoolsSchoolIdSportsQuotas,
  usePatchCompetitionSchoolsSchoolIdSportsSportIdQuotas,
  usePostCompetitionSchoolsSchoolIdSportsSportIdQuotas,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { SportQuotaInfo } from "../api/hyperionSchemas";

interface UseSchoolsSportQuotaProps {
  schoolId?: string;
}

export const useSchoolsSportQuota = ({
  schoolId,
}: UseSchoolsSportQuotaProps) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: schoolsSportQuota,
    refetch: refetchSchoolsSportQuota,
    error,
  } = useGetCompetitionSchoolsSchoolIdSportsQuotas(
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
      queryHash: "getschoolsSportQuota",
    },
  );

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } =
    usePostCompetitionSchoolsSchoolIdSportsSportIdQuotas();

  const createQuota = (
    sportId: string,
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    return mutateCreateQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId!,
          sportId,
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
            refetchSchoolsSportQuota();
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
    usePatchCompetitionSchoolsSchoolIdSportsSportIdQuotas();

  const updateQuota = (
    sportId: string,
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    return mutateUpdateQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId!,
          sportId,
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
            refetchSchoolsSportQuota();
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

  const { mutate: mutateDeleteQuota, isPending: isDeleteLoading } =
    useDeleteCompetitionSchoolsSchoolIdSportsSportIdQuotas();

  const deleteQuota = (sportId: string, callback: () => void) => {
    return mutateDeleteQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId!,
          sportId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression du quota",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchSchoolsSportQuota();
            callback();
            toast({
              title: "Quota supprimée",
              description: "Le quota a été supprimée avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    schoolsSportQuota,
    error,
    refetchSchoolsSportQuota,
    isCreateLoading,
    createQuota,
    isUpdateLoading,
    updateQuota,
    isDeleteLoading,
    deleteQuota,
  };
};
