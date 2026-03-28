import { useAuth } from "../useAuth";

export const useAllTeams = () => {
  const { isTokenExpired } = useAuth();
  const {
    data: allTeams,
    refetch: refetchAllTeams,
    isLoading,
    error,
  } = useGetCompetitionTeams(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: false,
    },
  );

  return {
    allTeams,
    refetchAllTeams,
    isLoading,
    error,
  };
};
