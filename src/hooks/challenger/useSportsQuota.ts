import { useAuth } from "../useAuth";

import { SportQuotaInfo } from "@/api";
import {
  deleteCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation,
  getCompetitionSportsSportIdQuotasOptions,
  patchCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation,
  postCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation,
} from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

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
      onSuccess: () => {
        refetchSportsQuota();
        toast({
          title: "Quota ajouté",
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
      { onSuccess: () => callback() },
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
      onSuccess: () => {
        refetchSportsQuota();
        toast({
          title: "Quota modifié",
          description: "Le quota a été modifié avec succès.",
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
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateDeleteQuota, isPending: isDeleteLoading } = useMutation(
    {
      ...deleteCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation(),
      onSuccess: () => {
        refetchSportsQuota();
        toast({
          title: "Quota supprimé",
          description: "Le quota a été supprimé avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression du quota",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail,
          variant: "destructive",
        });
      },
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
      { onSuccess: () => callback() },
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
