import { useAuth } from "../useAuth";

import { getCdrProductsOptions } from "@/api/@tanstack/react-query.gen";

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
