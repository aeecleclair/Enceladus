import { useAuth } from "../useAuth";

import { AppCoreDocumentsSchemasDocumentsTeam } from "@/api";
import { getDocumentsTeamsOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const useTeams = () => {
  const { isTokenExpired } = useAuth();

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
