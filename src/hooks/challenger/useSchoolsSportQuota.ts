import {
  deleteCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation,
  getCompetitionSchoolsSchoolIdSportsQuotasOptions,
  patchCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation,
  postCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "../useAuth";
import { useToast } from "@/components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "@/lib/challenger/errorTyping";
import { SportQuotaInfo } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

interface UseSchoolsSportQuotaProps {
  schoolId?: string;
}

export const useSchoolsSportQuota = ({
  schoolId,
}: UseSchoolsSportQuotaProps) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: schoolsSportQuota,
    refetch: refetchSchoolsSportQuota,
    error,
  } = useQuery({
    ...getCompetitionSchoolsSchoolIdSportsQuotasOptions({
      path: {
        school_id: schoolId!,
      },
    }),
    enabled: !isTokenExpired() && !!schoolId,
    retry: false,
    queryHash: "getschoolsSportQuota",
  });

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } = useMutation(
    {
      ...postCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation(),
    },
  );

  const createQuota = (
    sportId: string,
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    return mutateCreateQuota(
      {
        path: {
          school_id: schoolId!,
          sport_id: sportId,
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

  const { mutate: mutateUpdateQuota, isPending: isUpdateLoading } = useMutation(
    {
      ...patchCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation(),
    },
  );

  const updateQuota = (
    sportId: string,
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    return mutateUpdateQuota(
      {
        path: {
          school_id: schoolId!,
          sport_id: sportId,
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

  const { mutate: mutateDeleteQuota, isPending: isDeleteLoading } = useMutation(
    {
      ...deleteCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation(),
    },
  );

  const deleteQuota = (sportId: string, callback: () => void) => {
    return mutateDeleteQuota(
      {
        path: {
          school_id: schoolId!,
          sport_id: sportId,
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
