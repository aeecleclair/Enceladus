import { getCompetitionProductsAvailableOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useAvailableProducts = () => {
  const { isTokenExpired } = useAuth();

  const {
    data: availableProducts,
    refetch: refetchAvailableProducts,
    isLoading,
    error,
  } = useQuery({
    ...getCompetitionProductsAvailableOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  return {
    availableProducts,
    refetchAvailableProducts,
    isLoading,
    error,
  };
};
