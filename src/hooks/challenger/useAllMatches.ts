import { getCompetitionMatchesOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

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
