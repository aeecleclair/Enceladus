import { getCdrSellersSellerIdProductsProductIdDataOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useSellerProductData = (
  sellerId: string | null,
  productId: string | null,
) => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getCdrSellersSellerIdProductsProductIdDataOptions({
      path: { seller_id: sellerId!, product_id: productId! },
    }),
    retry: 3,
    enabled: !isTokenExpired() && !!sellerId && !!productId,
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};
