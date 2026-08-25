import { getCdrUsersUserIdPaymentsOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useUserPayments = (userId: string | null) => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getCdrUsersUserIdPaymentsOptions({
      path: { user_id: userId! },
    }),
    retry: 3,
    enabled: !isTokenExpired() && !!userId,
  });

  return {
    payments: data || [],
    total: data?.reduce((acc, payment) => acc + payment.total / 100, 0),
    isLoading,
    refetch,
  };
};
