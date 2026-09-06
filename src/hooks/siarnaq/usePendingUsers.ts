import { getCdrUsersPendingOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const usePendingUsers = () => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getCdrUsersPendingOptions(),
    retry: 3,
    enabled: !isTokenExpired(),
  });

  return {
    pendingUsers: data || [],
    isLoading,
    refetch,
  };
};
