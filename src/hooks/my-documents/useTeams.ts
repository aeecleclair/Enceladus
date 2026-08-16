import { useAuth } from "../useAuth";

import { AppCoreDocumentsSchemasDocumentsTeam } from "@/api";
import { getDocumentsTeamsOptions } from "@/api/@tanstack/react-query.gen";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useTeams = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const { data: allTeams } = useQuery({
    ...getDocumentsTeamsOptions({}),
    enabled: !isTokenExpired(),
    retry: false,
  });

  const teams: AppCoreDocumentsSchemasDocumentsTeam[] = [
    {
      id: "1",
      name: "Template 1",
      team_id: 1,
      group_id: "group1",
      api_key: "api_key_1",
    },
    {
      id: "2",
      name: "Template 2",
      team_id: 2,
      group_id: "group2",
      api_key: "api_key_2",
    },
    {
      id: "3",
      name: "Template 3",
      team_id: 3,
      group_id: "group3",
      api_key: "api_key_3",
    },
  ];

  return {
    teams: teams,
  };
};
