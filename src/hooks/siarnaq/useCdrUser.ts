import { getCdrUsersUserIdOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useCdrUser = (userId: string | null) => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getCdrUsersUserIdOptions({
      path: { user_id: userId! },
    }),
    retry: 3,
    enabled: !isTokenExpired() && !!userId,
  });

  return {
    user: data,
    isLoading,
    refetch,
  };
};
