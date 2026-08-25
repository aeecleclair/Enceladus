import { SchoolExtensionBase, SchoolExtensionEdit } from "@/api";
import {
  deleteCompetitionSchoolsSchoolIdMutation,
  getCompetitionSchoolsOptions,
  patchCompetitionSchoolsSchoolIdMutation,
  postCompetitionSchoolsMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

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
        onSuccess: () => {
          refetchSchools();
          callback();
          toast({
            title: "École ajoutée",
            description: "L'école a été ajoutée avec succès.",
          });
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: "Erreur lors de l'ajout de l'école",
            description:
              (error as unknown as ErrorType)?.stack?.body ||
              (error as unknown as DetailedErrorType)?.stack?.detail ||
              "Une erreur est survenue, veuillez réessayer.",
            variant: "destructive",
          });
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
        onSuccess: () => {
          refetchSchools();
          callback();
          toast({
            title: "École mise à jour",
            description: "L'école a été mise à jour avec succès.",
          });
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: "Erreur lors de la mise à jour de l'école",
            description:
              (error as unknown as ErrorType)?.stack?.body ||
              (error as unknown as DetailedErrorType)?.stack?.detail ||
              "Une erreur est survenue, veuillez réessayer.",
            variant: "destructive",
          });
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
        onSuccess: () => {
          refetchSchools();
          callback();
          toast({
            title: "École supprimée",
            description: "L'école a été supprimée avec succès.",
          });
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: "Erreur lors de la suppression de l'école",
            description:
              (error as unknown as ErrorType)?.stack?.body ||
              (error as unknown as DetailedErrorType)?.stack?.detail ||
              "Une erreur est survenue, veuillez réessayer.",
            variant: "destructive",
          });
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
