import { getMembershipsOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useMemberships = () => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getMembershipsOptions(),
    retry: 3,
    enabled: !isTokenExpired(),
  });

  return {
    memberships: data || [],
    isLoading,
    refetch,
  };
};
