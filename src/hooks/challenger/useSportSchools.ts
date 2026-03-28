import {
  useGetCompetitionSchools,
  usePostCompetitionSchools,
  usePatchCompetitionSchoolsSchoolId,
  useDeleteCompetitionSchoolsSchoolId,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import {
  SchoolExtensionBase,
  SchoolExtensionEdit,
} from "../api/hyperionSchemas";

export const useSportSchools = () => {
  const { token, isTokenExpired } = useAuth();
  const NoSchoolId = "dce19aa2-8863-4c93-861e-fb7be8f610ed";

  const {
    data: sportSchools,
    refetch: refetchSchools,
    error,
  } = useGetCompetitionSchools(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: false,
      queryHash: "getSportSchools",
    },
  );

  const { mutate: mutateCompetitionSchool, isPending: isLoading } =
    usePostCompetitionSchools();

  const createCompetitionSchool = (
    body: SchoolExtensionBase,
    callback: () => void,
  ) => {
    return mutateCompetitionSchool(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la fusion des équipes",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
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
    usePatchCompetitionSchoolsSchoolId();

  const updateCompetitionSchool = (
    schoolId: string,
    body: SchoolExtensionEdit,
    callback: () => void,
  ) => {
    return mutatePatchCompetitionSchool(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la mise à jour",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
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
    useDeleteCompetitionSchoolsSchoolId();

  const deleteCompetitionSchool = (schoolId: string, callback: () => void) => {
    return mutateDeleteCompetitionSchool(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
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
