import { getMembershipsUsersUserIdOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useUserMemberships = (userId: string | null) => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getMembershipsUsersUserIdOptions({
      path: { user_id: userId! },
    }),
    retry: 3,
    enabled: !isTokenExpired() && !!userId,
  });

  return {
    userMemberships: data || [],
    isLoading,
    refetch,
  };
};
