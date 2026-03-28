import {
  deleteCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation,
  getCompetitionSportsSportIdQuotasOptions,
  patchCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation,
  postCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "../useAuth";
import { useToast } from "@/components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "@/lib/challenger/errorTyping";
import { SportQuotaInfo } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

interface UseSportsQuotaProps {
  sportId?: string;
}

export const useSportsQuota = ({ sportId }: UseSportsQuotaProps) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: sportsQuota,
    refetch: refetchSportsQuota,
    error,
  } = useQuery({
    ...getCompetitionSportsSportIdQuotasOptions({
      path: {
        sport_id: sportId!,
      },
    }),
    enabled: !isTokenExpired() && !!sportId,
    retry: false,
    queryHash: "getSportsQuota",
  });

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } = useMutation(
    {
      ...postCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation(),
    },
  );

  const createQuota = (
    schoolId: string,
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    return mutateCreateQuota(
      {
        path: {
          sport_id: sportId!,
          school_id: schoolId,
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
              path: {
                sport_id: sportId!,
                school_id: schoolId,
              },
              body,
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
          description:
            "Impossible d'ajouter les quotas pour toutes les écoles.",
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

  const { mutate: mutateUpdateQuota, isPending: isUpdateLoading } = useMutation(
    {
      ...patchCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation(),
    },
  );

  const updateQuota = (
    schoolId: string,
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    return mutateUpdateQuota(
      {
        path: {
          sport_id: sportId!,
          school_id: schoolId,
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

  const { mutate: mutateDeleteQuota, isPending: isDeleteLoading } = useMutation(
    {
      ...deleteCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation(),
    },
  );

  const deleteQuota = (schoolId: string, callback: () => void) => {
    return mutateDeleteQuota(
      {
        path: {
          sport_id: sportId!,
          school_id: schoolId,
        },
      },
      {
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression du quota",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
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
