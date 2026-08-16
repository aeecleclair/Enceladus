import { useAuth } from "../useAuth";

import { AppCoreDocumentsSchemasDocumentsTeamComplete } from "@/api";
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
        onSuccess: (data) => {
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
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: teamsQueryKey });
        },
      },
    );
  };

  const teams: AppCoreDocumentsSchemasDocumentsTeamComplete[] = [
    {
      id: "1",
      name: "Team 1",
      team_id: 1,
      group_id: "group1",
      api_key: "api_key_1",
      group: {
        id: "group1",
        name: "Group 1",
      },
      templates: [
        {
          id: "1",
          documenso_id: 1,
          name: "Template 1",
          recipient_id: 1,
          team_id: "1",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          statistics: {
            total_documents: 10,
            total_signed_documents: 5,
            total_pending_documents: 3,
            total_rejected_documents: 2,
          },
        },
        {
          id: "2",
          documenso_id: 2,
          name: "Template 2",
          recipient_id: 1,
          team_id: "1",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          statistics: {
            total_documents: 20,
            total_signed_documents: 10,
            total_pending_documents: 5,
            total_rejected_documents: 5,
          },
        },
        {
          id: "3",
          documenso_id: 3,
          name: "Template 3",
          recipient_id: 1,
          team_id: "1",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          statistics: {
            total_documents: 15,
            total_signed_documents: 7,
            total_pending_documents: 5,
            total_rejected_documents: 3,
          },
        },
      ],
    },
    {
      id: "2",
      name: "Team 2",
      team_id: 2,
      group_id: "group2",
      api_key: "api_key_2",
      group: {
        id: "group2",
        name: "Group 2",
      },
      templates: [
        {
          id: "4",
          documenso_id: 4,
          name: "Template 4",
          recipient_id: 1,
          team_id: "2",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          statistics: {
            total_documents: 30,
            total_signed_documents: 15,
            total_pending_documents: 10,
            total_rejected_documents: 5,
          },
        },
        {
          id: "5",
          documenso_id: 5,
          name: "Template 5",
          recipient_id: 1,
          team_id: "2",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          statistics: {
            total_documents: 1,
            total_signed_documents: 0,
            total_pending_documents: 1,
            total_rejected_documents: 0,
          },
        },
        {
          id: "6",
          documenso_id: 6,
          name: "Template 6",
          recipient_id: 1,
          team_id: "2",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          statistics: {
            total_documents: 25,
            total_signed_documents: 12,
            total_pending_documents: 8,
            total_rejected_documents: 5,
          },
        },
      ],
    },
  ];

  return {
    teams: teams,
    createTeam,
    updateTeam,
    isCreateTeamLoading,
    isUpdateLoading,
  };
};
