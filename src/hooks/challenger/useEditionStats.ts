import { useAuth } from "../useAuth";

import { getCompetitionEditionsEditionIdStatsOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

interface UseEditionStatsProps {
  editionId?: string;
}

export const useEditionStats = ({ editionId }: UseEditionStatsProps) => {
  const { isTokenExpired } = useAuth();

  const {
    data: stats,
    isLoading,
    refetch: refetchStats,
  } = useQuery({
    ...getCompetitionEditionsEditionIdStatsOptions({
      path: {
        edition_id: editionId!,
      },
    }),
    enabled: !isTokenExpired() && !!editionId,
    retry: false,
    queryHash: "getEditionStats-" + editionId,
  });

  return {
    stats,
    isLoading,
    refetchStats,
  };
};
