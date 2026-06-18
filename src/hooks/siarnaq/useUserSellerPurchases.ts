import { useAuth } from "../useAuth";

import { getCdrSellersSellerIdUsersUserIdPurchasesOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const useUserSellerPurchases = (
  userId: string | null,
  sellerId: string | null,
) => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getCdrSellersSellerIdUsersUserIdPurchasesOptions({
      path: { user_id: userId!, seller_id: sellerId! },
    }),
    retry: 3,
    enabled: !isTokenExpired() && !!userId && !!sellerId,
  });

  return {
    purchases: data || [],
    isLoading,
    refetch,
  };
};
