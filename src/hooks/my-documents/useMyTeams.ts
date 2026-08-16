import { useAuth } from "../useAuth";

import { AppCoreDocumentsSchemasDocumentsTeamComplete } from "@/api";
import {
  getDocumentsTeamsMeOptions,
  getDocumentsTeamsMeQueryKey,
  postDocumentsTeamsMutation,
} from "@/api/@tanstack/react-query.gen";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useMyTeams = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

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
        onSuccess: (data) => {},
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
          team_id: "1",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          documenso_id: 2,
          name: "Template 2",
          team_id: "1",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          documenso_id: 3,
          name: "Template 3",
          team_id: "1",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
          team_id: "2",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "5",
          documenso_id: 5,
          name: "Template 5",
          team_id: "2",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "6",
          documenso_id: 6,
          name: "Template 6",
          team_id: "2",
          deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    },
  ];

  return {
    teams: teams,
    createTeam,
    isCreateTeamLoading,
  };
};
