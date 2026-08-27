import { getCompetitionTeamsSportsSportIdOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

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
