import { getCdrProductsOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useProducts = () => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getCdrProductsOptions(),
    enabled: !isTokenExpired(),
  });

  return {
    products: data || [],
    isLoading,
    refetch,
  };
};
