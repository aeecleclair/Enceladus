import { useAuth } from "../useAuth";

import { SchoolGeneralQuotaBase } from "@/api";
import {
  getCompetitionSchoolsSchoolIdGeneralQuotaOptions,
  patchCompetitionSchoolsSchoolIdGeneralQuotaMutation,
  postCompetitionSchoolsSchoolIdGeneralQuotaMutation,
} from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

interface UseSchoolsGeneralQuotaProps {
  schoolId?: string;
}

export const useSchoolsGeneralQuota = ({
  schoolId,
}: UseSchoolsGeneralQuotaProps) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: schoolsGeneralQuota,
    refetch: refetchSchoolsGeneralQuota,
    error,
  } = useQuery({
    ...getCompetitionSchoolsSchoolIdGeneralQuotaOptions({
      path: {
        school_id: schoolId!,
      },
    }),
    enabled: !isTokenExpired() && !!schoolId,
    retry: false,
    queryHash: "getSchoolsGeneralQuota",
  });

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } = useMutation(
    {
      ...postCompetitionSchoolsSchoolIdGeneralQuotaMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout du quota",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchSchoolsGeneralQuota();
        toast({
          title: "Quota ajoutée",
          description: "Le quota a été ajouté avec succès.",
        });
      },
    },
  );

  const createQuota = (body: SchoolGeneralQuotaBase, callback: () => void) => {
    return mutateCreateQuota(
      {
        path: {
          school_id: schoolId!,
        },
        body,
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateUpdateQuota, isPending: isUpdateLoading } = useMutation(
    {
      ...patchCompetitionSchoolsSchoolIdGeneralQuotaMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la modification du quota",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchSchoolsGeneralQuota();
        toast({
          title: "Quota modifiée",
          description: "Le quota a été modifiée avec succès.",
        });
      },
    },
  );

  const updateQuota = (body: SchoolGeneralQuotaBase, callback: () => void) => {
    return mutateUpdateQuota(
      {
        path: {
          school_id: schoolId!,
        },
        body,
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  return {
    schoolsGeneralQuota,
    error,
    refetchSchoolsGeneralQuota,
    isCreateLoading,
    createQuota,
    isUpdateLoading,
    updateQuota,
  };
};
