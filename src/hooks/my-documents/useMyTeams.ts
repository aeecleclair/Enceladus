import { useAuth } from "../useAuth";

import {
  getDocumentsTeamsMeOptions,
  getDocumentsTeamsMeQueryKey,
  patchDocumentsTeamsTeamIdMutation,
  postDocumentsTeamsMutation,
} from "@/api/@tanstack/react-query.gen";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useMyTeams = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: myTeams } = useQuery({
    ...getDocumentsTeamsMeOptions({}),
    enabled: !isTokenExpired(),
    retry: false,
  });

  const teamsQueryKey = getDocumentsTeamsMeQueryKey();

  const { mutate: mutateCreateTeam, isPending: isCreateTeamLoading } =
    useMutation({
      ...postDocumentsTeamsMutation(),
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "L'équipe a été créée avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la création de l'équipe",
          description: "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
    });

  const createTeam = (body: {
    name: string;
    group_id: string;
    api_key: string;
  }) => {
    return mutateCreateTeam(
      { body },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: teamsQueryKey });
        },
      },
    );
  };

  const { mutate: mutateUpdateTeam, isPending: isUpdateLoading } = useMutation({
    ...patchDocumentsTeamsTeamIdMutation(),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "L'équipe a été mise à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la mise à jour de l'équipe",
        description: "Une erreur est survenue, veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const updateTeam = (
    teamId: string,
    body: { name: string; group_id: string; api_key: string },
  ) => {
    return mutateUpdateTeam(
      { path: { team_id: teamId }, body },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: teamsQueryKey });
        },
      },
    );
  };

  return {
    teams: myTeams ?? [],
    createTeam,
    updateTeam,
    isCreateTeamLoading,
    isUpdateLoading,
  };
};
