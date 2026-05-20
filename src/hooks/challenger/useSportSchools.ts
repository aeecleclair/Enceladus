import {
  deleteCompetitionSchoolsSchoolIdMutation,
  getCompetitionSchoolsOptions,
  patchCompetitionSchoolsSchoolIdMutation,
  postCompetitionSchoolsMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "../useAuth";
import { useToast } from "@/components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "@/lib/challenger/errorTyping";
import { SchoolExtensionBase, SchoolExtensionEdit } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSportSchools = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const NoSchoolId = "dce19aa2-8863-4c93-861e-fb7be8f610ed";

  const {
    data: sportSchools,
    refetch: refetchSchools,
    error,
  } = useQuery({
    ...getCompetitionSchoolsOptions(),
    enabled: !isTokenExpired(),
    retry: false,
    queryHash: "getSportSchools",
  });

  const { mutate: mutateCompetitionSchool, isPending: isLoading } = useMutation(
    {
      ...postCompetitionSchoolsMutation(),
    },
  );

  const createCompetitionSchool = (
    body: SchoolExtensionBase,
    callback: () => void,
  ) => {
    return mutateCompetitionSchool(
      {
        body,
      },
      {
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la fusion des équipes",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            refetchSchools();
            callback();
            toast({
              title: "École ajoutée",
              description: "L'école a été ajoutée avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutatePatchCompetitionSchool, isPending: isUpdateLoading } =
    useMutation({
      ...patchCompetitionSchoolsSchoolIdMutation(),
    });

  const updateCompetitionSchool = (
    schoolId: string,
    body: SchoolExtensionEdit,
    callback: () => void,
  ) => {
    return mutatePatchCompetitionSchool(
      {
        path: {
          school_id: schoolId,
        },
        body,
      },
      {
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la mise à jour",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            refetchSchools();
            callback();
            toast({
              title: "École mise à jour",
              description: "L'école a été mise à jour avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeleteCompetitionSchool, isPending: isDeleteLoading } =
    useMutation({
      ...deleteCompetitionSchoolsSchoolIdMutation(),
    });

  const deleteCompetitionSchool = (schoolId: string, callback: () => void) => {
    return mutateDeleteCompetitionSchool(
      {
        path: {
          school_id: schoolId,
        },
      },
      {
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            refetchSchools();
            callback();
            toast({
              title: "École supprimée",
              description: "L'école a été supprimée avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    NoSchoolId,
    sportSchools,
    createCompetitionSchool,
    updateCompetitionSchool,
    deleteCompetitionSchool,
    error,
    isLoading,
    isUpdateLoading,
    isDeleteLoading,
    refetchSchools,
  };
};
