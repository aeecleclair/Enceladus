import { getCdrUsersUserIdPurchasesOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useUserPurchases = (userId: string | null) => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getCdrUsersUserIdPurchasesOptions({
      path: { user_id: userId! },
    }),
    retry: 3,
    enabled: !isTokenExpired() && !!userId,
  });

  return {
    purchases: data || [],
    total: data?.reduce<number>(
      (acc, purchase) => acc + (purchase.quantity * purchase.price) / 100,
      0,
    ),
    isLoading,
    refetch,
  };
};
