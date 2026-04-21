import { getCompetitionProductsAvailableOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

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
