import { getCdrCurriculumsOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useCurriculums = () => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getCdrCurriculumsOptions(),
    retry: 3,
    enabled: !isTokenExpired(),
  });

  return {
    curriculums: data || [],
    isLoading,
    refetch,
  };
};
