import { getCompetitionMatchesOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useAllMatches = () => {
  const { isTokenExpired } = useAuth();
  const {
    data: allMatches,
    refetch: refetchAllMatches,
    isLoading,
    error,
  } = useQuery({
    ...getCompetitionMatchesOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  return {
    allMatches,
    refetchAllMatches,
    isLoading,
    error,
  };
};
