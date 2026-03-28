import { getCompetitionTeamsSportsSportIdOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

interface UseSportTeamsProps {
  sportId?: string;
}

export const useSportTeams = ({ sportId }: UseSportTeamsProps) => {
  const { isTokenExpired } = useAuth();

  const {
    data: sportTeams,
    isLoading,
    refetch: refetchTeams,
  } = useQuery({
    ...getCompetitionTeamsSportsSportIdOptions({
      path: {
        sport_id: sportId!,
      },
    }),
    enabled: !isTokenExpired() && !!sportId,
    retry: false,
    queryHash: "getSportTeams-" + sportId,
  });

  return {
    sportTeams,
    isLoading,
    refetchTeams,
  };
};
