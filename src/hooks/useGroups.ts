import { getGroupsOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useGroups = () => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getGroupsOptions(),
    retry: 3,
    enabled: !isTokenExpired(),
  });

  return {
    groups: data || [],
    isLoading,
    refetch,
  };
};
