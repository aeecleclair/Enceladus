import { getDocumentsTeamsOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useTeams = () => {
  const { isTokenExpired } = useAuth();

  const { data: allTeams } = useQuery({
    ...getDocumentsTeamsOptions({}),
    enabled: !isTokenExpired(),
    retry: false,
  });

  return {
    teams: allTeams ?? [],
  };
};
