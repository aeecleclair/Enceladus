import { useAuth } from "../useAuth";

import { SportQuotaInfo } from "@/api";
import {
  deleteCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation,
  getCompetitionSchoolsSchoolIdSportsQuotasOptions,
  patchCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation,
  postCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation,
} from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

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
    queryHash: `getSchoolsSportQuota-${schoolId}`,
  });

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } = useMutation(
    {
      ...postCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation(),
      onSuccess: () => {
        refetchSchoolsSportQuota();
        toast({
          title: "Quota ajoutée",
          description: "Le quota a été ajouté avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout du quota",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
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
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateUpdateQuota, isPending: isUpdateLoading } = useMutation(
    {
      ...patchCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation(),
      onSuccess: () => {
        refetchSchoolsSportQuota();
        toast({
          title: "Quota modifiée",
          description: "Le quota a été modifiée avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la modification du quota",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
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
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateDeleteQuota, isPending: isDeleteLoading } = useMutation(
    {
      ...deleteCompetitionSchoolsSchoolIdSportsSportIdQuotasMutation(),
      onSuccess: () => {
        refetchSchoolsSportQuota();
        toast({
          title: "Quota supprimée",
          description: "Le quota a été supprimée avec succès.",
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
      { onSuccess: () => callback() },
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
