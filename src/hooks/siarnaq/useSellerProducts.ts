import { getCdrSellersSellerIdProductsOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useSellerProducts = (sellerId: string | null) => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getCdrSellersSellerIdProductsOptions({
      path: { seller_id: sellerId! },
    }),
    retry: 3,
    enabled: !isTokenExpired() && !!sellerId,
  });

  return {
    products:
      data?.sort((a, b) => {
        return Number(a.needs_validation) - Number(b.needs_validation);
      }) || [],
    isLoading,
    refetch,
  };
};
