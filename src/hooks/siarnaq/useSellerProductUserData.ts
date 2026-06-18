import { useAuth } from "../useAuth";

import { getCdrSellersSellerIdProductsProductIdUsersUserIdDataFieldIdOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const useSellerProductUserData = (
  sellerId: string | null,
  productId: string | null,
  userId: string | null,
  fieldId: string | null,
) => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getCdrSellersSellerIdProductsProductIdUsersUserIdDataFieldIdOptions({
      path: {
        seller_id: sellerId!,
        product_id: productId!,
        user_id: userId!,
        field_id: fieldId!,
      },
    }),
    retry: 3,
    enabled:
      !isTokenExpired() && !!sellerId && !!productId && !!userId && !!fieldId,
  });

  return {
    response: data || [],
    isLoading,
    refetch,
  };
};
