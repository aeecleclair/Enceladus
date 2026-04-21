import { getCompetitionPodiumsSportsSportIdOptions } from "@/api/@tanstack/react-query.gen";
import { useQueries } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { TeamSportResultComplete } from "@/api";

interface useSportPodiumsProps {
  sportIds: string[];
}

export const useSportPodiums = ({ sportIds }: useSportPodiumsProps) => {
  const { isTokenExpired } = useAuth();

  const queries = useQueries({
    queries: sportIds.map((sportId) => {
      const options = getCompetitionPodiumsSportsSportIdOptions({
        path: {
          sport_id: sportId,
        },
      });

      return {
        ...options,
        enabled: !isTokenExpired(),
        retry: false,
        staleTime: 5 * 60 * 1000,
      };
    }),
  });

  const podiumsBySport = sportIds.reduce(
    (acc, sportId, index) => {
      const query = queries[index];
      if (query.data) {
        acc[sportId] = query.data;
      }
      return acc;
    },
    {} as Record<string, TeamSportResultComplete[]>,
  );

  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.error);

  return {
    podiumsBySport,
    isLoading,
    hasError,
  };
};
