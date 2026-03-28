import { useGetCompetitionTeamsSportsSportId } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";

interface UseSportTeamsProps {
  sportId?: string;
}

export const useSportTeams = ({ sportId }: UseSportTeamsProps) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: sportTeams,
    isLoading,
    refetch: refetchTeams,
  } = useGetCompetitionTeamsSportsSportId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        sportId: sportId!,
      },
    },
    {
      enabled: !isTokenExpired() && !!sportId,
      retry: false,
      queryHash: "getSportTeams-" + sportId,
    },
  );

  return {
    sportTeams,
    isLoading,
    refetchTeams,
  };
};
