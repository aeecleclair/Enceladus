import { useAuth } from "../useAuth";

import { getCompetitionTeamsOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const useAllTeams = () => {
  const { isTokenExpired } = useAuth();
  const {
    data: allTeams,
    refetch: refetchAllTeams,
    isLoading,
    error,
  } = useQuery({
    ...getCompetitionTeamsOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  return {
    allTeams,
    refetchAllTeams,
    isLoading,
    error,
  };
};
