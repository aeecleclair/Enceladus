import { getDocumentsTeamsTeamIdTemplatesOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useTemplates = (teamId: string) => {
  const { isTokenExpired } = useAuth();

  const { data: teamTemplates } = useQuery({
    ...getDocumentsTeamsTeamIdTemplatesOptions({
      path: {
        team_id: teamId,
      },
    }),
    enabled: !isTokenExpired(),
    retry: false,
  });
  return {
    teamTemplates: teamTemplates ?? [],
  };
};
