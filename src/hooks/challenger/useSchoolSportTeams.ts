import { useAuth } from "../useAuth";

import { Team, TeamEdit, TeamInfo } from "@/api";
import { getCompetitionTeamsSportsSportIdSchoolsSchoolIdOptions } from "@/api/@tanstack/react-query.gen";
import {
  deleteCompetitionTeamsTeamIdMutation,
  patchCompetitionTeamsTeamIdMutation,
  postCompetitionTeamsMutation,
} from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

interface UseSchoolSportTeamsProps {
  schoolId?: string;
  sportId?: string;
}

export const useSchoolSportTeams = ({
  schoolId,
  sportId,
}: UseSchoolSportTeamsProps) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: teams,
    isLoading,
    refetch: refetchTeams,
  } = useQuery({
    ...getCompetitionTeamsSportsSportIdSchoolsSchoolIdOptions({
      path: {
        school_id: schoolId!,
        sport_id: sportId!,
      },
    }),
    enabled: !isTokenExpired() && !!schoolId && !!sportId,
    retry: false,
    queryHash: "getSchoolSportTeams-" + schoolId + "-" + sportId,
  });

  const { mutate: mutateCreateSchoolSportTeam, isPending: isCreateLoading } =
    useMutation({
      ...postCompetitionTeamsMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout de l'équipe",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchTeams();
        toast({
          title: "Équipe ajoutée",
          description: "L'équipe a été ajoutée avec succès.",
        });
      },
    });

  const createSchoolSportTeam = (
    teamData: TeamInfo,
    callback: (data: Team) => void,
  ) => {
    return mutateCreateSchoolSportTeam(
      { body: teamData },
      { onSuccess: (data) => callback(data) },
    );
  };

  const { mutate: mutateUpdateSchoolSportTeam, isPending: isUpdateLoading } =
    useMutation({
      ...patchCompetitionTeamsTeamIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la mise à jour de l'équipe",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: (data) => {
        refetchTeams();
        toast({
          title: "Équipe mise à jour",
          description: "L'équipe a été mise à jour avec succès.",
        });
        return data;
      },
    });

  const updateSchoolSportTeam = (
    teamId: string,
    teamData: TeamEdit,
    callback: () => void,
  ) => {
    return mutateUpdateSchoolSportTeam(
      {
        path: { team_id: teamId },
        body: teamData,
      },
      { onSuccess: () => callback() },
    );
  };

  const { mutate: mutateDeleteSchoolSportTeam, isPending: isDeleteLoading } =
    useMutation({
      ...deleteCompetitionTeamsTeamIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression de l'équipe",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchTeams();
        toast({
          title: "Équipe supprimée",
          description: "L'équipe a été supprimée avec succès.",
        });
      },
    });

  const deleteSchoolSportTeam = (teamId: string, callback: () => void) => {
    return mutateDeleteSchoolSportTeam(
      { path: { team_id: teamId } },
      { onSuccess: () => callback() },
    );
  };

  return {
    teams,
    isLoading,
    refetchTeams,
    createSchoolSportTeam,
    isCreateLoading,
    updateSchoolSportTeam,
    isUpdateLoading,
    deleteSchoolSportTeam,
    isDeleteLoading,
  };
};
