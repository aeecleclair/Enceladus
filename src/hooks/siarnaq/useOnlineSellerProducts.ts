import { getCdrOnlineSellersSellerIdProductsOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useOnlineSellerProducts = (sellerId: string | null) => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getCdrOnlineSellersSellerIdProductsOptions({
      path: { seller_id: sellerId! },
    }),
    retry: 3,
    enabled: !isTokenExpired() && !!sellerId,
  });

  return {
    onlineProducts: data || [],
    isLoading,
    refetch,
  };
};
