import { useAuth } from "../useAuth";
import { useToast } from "@/components/ui/use-toast";
import { SchoolGeneralQuotaBase } from "@/api";
import { useMutation } from "@tanstack/react-query";
import {
  patchCompetitionSchoolsSchoolIdGeneralQuotaMutation,
  postCompetitionSchoolsSchoolIdGeneralQuotaMutation,
} from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

interface UseSchoolsGeneralQuotaProps {
  schoolId?: string;
}

export const useSchoolsGeneralQuota = ({
  schoolId,
}: UseSchoolsGeneralQuotaProps) => {
  const { token, isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: schoolsGeneralQuota,
    refetch: refetchSchoolsGeneralQuota,
    error,
  } = useGetCompetitionSchoolsSchoolIdGeneralQuota(
    {
      pathParams: {
        schoolId: schoolId!,
      },
    },
    {
      enabled: !isTokenExpired() && !!schoolId,
      retry: false,
      queryHash: "getSchoolsGeneralQuota",
    },
  );

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } = useMutation(
    {
      ...postCompetitionSchoolsSchoolIdGeneralQuotaMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout du quota",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
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
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
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
