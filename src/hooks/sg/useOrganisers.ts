import { useAuth } from "../useAuth";

import { getTicketingOrganisersOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const useOrganisers = () => {
  const { isTokenExpired } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    ...getTicketingOrganisersOptions(),
    retry: 3,
    enabled: !isTokenExpired(),
  });

  return {
    organisers: data || [],
    isLoading,
    refetch,
  };
};