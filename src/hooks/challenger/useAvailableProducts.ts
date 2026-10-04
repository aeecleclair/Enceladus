import { getCompetitionProductsAvailableOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useAvailableProductsVariants = () => {
  const { isTokenExpired } = useAuth();

  const {
    data: availableProductsVariants,
    refetch: refetchAvailableProductsVariants,
    isLoading,
    error,
  } = useQuery({
    ...getCompetitionProductsAvailableOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  return {
    availableProductsVariants,
    refetchAvailableProductsVariants,
    isLoading,
    error,
  };
};
