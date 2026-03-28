import {
  useGetCompetitionSportsSportIdQuotas,
  usePostCompetitionSchoolsSchoolIdSportsSportIdQuotas,
  usePatchCompetitionSchoolsSchoolIdSportsSportIdQuotas,
  useDeleteCompetitionSchoolsSchoolIdSportsSportIdQuotas,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { SportQuotaInfo } from "../api/hyperionSchemas";

interface UseSportsQuotaProps {
  sportId?: string;
}

export const useSportsQuota = ({ sportId }: UseSportsQuotaProps) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: sportsQuota,
    refetch: refetchSportsQuota,
    error,
  } = useGetCompetitionSportsSportIdQuotas(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        sportId: sportId!,
      },
    },
    {
      enabled: !isTokenExpired() && !!sportId,
      retry: false,
      queryHash: "getSportsQuota",
    },
  );

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } =
    usePostCompetitionSchoolsSchoolIdSportsSportIdQuotas();

  const createQuota = (
    schoolId: string,
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    return mutateCreateQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          sportId: sportId!,
          schoolId,
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
            refetchSportsQuota();
            callback();
            toast({
              title: "Quota ajouté",
              description: "Le quota a été ajouté avec succès.",
            });
          }
        },
      },
    );
  };

  // New function to create quotas for all schools
  const createQuotaForAllSchools = (
    schoolIds: string[],
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    const promises = schoolIds.map(
      (schoolId) =>
        new Promise((resolve, reject) => {
          mutateCreateQuota(
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              pathParams: {
                sportId: sportId!,
                schoolId,
              },
              body: body,
            },
            {
              onSettled: (data, error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(data);
                }
              },
            },
          );
        }),
    );

    Promise.allSettled(promises).then((results) => {
      const failures = results.filter((result) => result.status === "rejected");
      const successes = results.filter(
        (result) => result.status === "fulfilled",
      );

      refetchSportsQuota();
      callback();

      if (failures.length === 0) {
        toast({
          title: "Quotas ajoutés",
          description: `Les quotas ont été ajoutés avec succès pour ${successes.length} école(s).`,
        });
      } else if (successes.length === 0) {
        toast({
          title: "Erreur lors de l'ajout des quotas",
          description: `Impossible d'ajouter les quotas pour toutes les écoles.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Quotas partiellement ajoutés",
          description: `Les quotas ont été ajoutés pour ${successes.length} école(s). ${failures.length} ont échoué.`,
          variant: "destructive",
        });
      }
    });
  };

  const { mutate: mutateUpdateQuota, isPending: isUpdateLoading } =
    usePatchCompetitionSchoolsSchoolIdSportsSportIdQuotas();

  const updateQuota = (
    schoolId: string,
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    return mutateUpdateQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          sportId: sportId!,
          schoolId,
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
            refetchSportsQuota();
            callback();
            toast({
              title: "Quota modifié",
              description: "Le quota a été modifié avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeleteQuota, isPending: isDeleteLoading } =
    useDeleteCompetitionSchoolsSchoolIdSportsSportIdQuotas();

  const deleteQuota = (schoolId: string, callback: () => void) => {
    return mutateDeleteQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          sportId: sportId!,
          schoolId,
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
            refetchSportsQuota();
            callback();
            toast({
              title: "Quota supprimé",
              description: "Le quota a été supprimé avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    sportsQuota,
    error,
    refetchSportsQuota,
    isCreateLoading,
    createQuota,
    createQuotaForAllSchools,
    isUpdateLoading,
    updateQuota,
    isDeleteLoading,
    deleteQuota,
  };
};
