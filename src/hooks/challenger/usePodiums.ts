import { SportPodiumRankings } from "@/api";
import {
  deleteCompetitionPodiumsSportsSportIdMutation,
  getCompetitionPodiumsGlobalOptions,
  getCompetitionPodiumsSchoolsSchoolIdOptions,
  getCompetitionPodiumsSportsSportIdOptions,
  postCompetitionPodiumsSportsSportIdMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

interface UsePodiumsProps {
  sportId?: string;
  schoolId?: string;
}

export const usePodiums = (props?: UsePodiumsProps) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const { sportId, schoolId } = props || {};

  // Global podium
  const {
    data: globalPodium,
    isLoading: isGlobalLoading,
    refetch: refetchGlobalPodium,
    error: globalError,
  } = useQuery({
    ...getCompetitionPodiumsGlobalOptions(),
    enabled: !isTokenExpired(),
    retry: false,
    queryHash: "getGlobalPodium",
  });

  // Sport-specific podium
  const {
    data: sportPodium,
    isLoading: isSportLoading,
    refetch: refetchSportPodium,
    error: sportError,
  } = useQuery({
    ...getCompetitionPodiumsSportsSportIdOptions({
      path: {
        sport_id: sportId!,
      },
    }),
    enabled: !!sportId && !isTokenExpired(),
    retry: false,
    queryHash: `getSportPodium-${sportId}`,
  });

  // School-specific podium
  const {
    data: schoolPodium,
    isLoading: isSchoolLoading,
    refetch: refetchSchoolPodium,
    error: schoolError,
  } = useQuery({
    ...getCompetitionPodiumsSchoolsSchoolIdOptions({
      path: {
        school_id: schoolId!,
      },
    }),
    enabled: !!schoolId && !isTokenExpired(),
    retry: false,
    queryHash: `getSchoolPodium-${schoolId}`,
  });

  const {
    mutate: mutateCreateOrUpdateSportPodium,
    isPending: isUpdateLoading,
  } = useMutation({
    ...postCompetitionPodiumsSportsSportIdMutation(),
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la mise à jour du podium",
        description:
          (error as unknown as ErrorType)?.stack?.body ||
          (error as unknown as DetailedErrorType)?.stack?.detail ||
          "Une erreur est survenue, veuillez réessayer.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      refetchGlobalPodium();
      if (sportId) {
        refetchSportPodium();
      }
      toast({
        title: "Podium mis à jour",
        description: "Le podium a été mis à jour avec succès.",
      });
    },
  });

  const createOrUpdateSportPodium = (
    targetSportId: string,
    rankings: SportPodiumRankings,
    callback: () => void,
  ) => {
    return mutateCreateOrUpdateSportPodium(
      {
        path: {
          sport_id: targetSportId,
        },
        body: rankings,
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateDeleteSportPodium, isPending: isDeleteLoading } =
    useMutation({
      ...deleteCompetitionPodiumsSportsSportIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression du podium",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchGlobalPodium();
        if (sportId) {
          refetchSportPodium();
        }
        toast({
          title: "Podium supprimé",
          description: "Le podium a été supprimé avec succès.",
        });
      },
    });

  const deleteSportPodium = (targetSportId: string, callback: () => void) => {
    return mutateDeleteSportPodium(
      {
        path: {
          sport_id: targetSportId,
        },
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  return {
    globalPodium,
    sportPodium,
    schoolPodium,
    createOrUpdateSportPodium,
    deleteSportPodium,
    isGlobalLoading,
    isSportLoading,
    isSchoolLoading,
    isUpdateLoading,
    isDeleteLoading,
    globalError,
    sportError,
    schoolError,
    refetchGlobalPodium,
    refetchSportPodium,
    refetchSchoolPodium,
  };
};
