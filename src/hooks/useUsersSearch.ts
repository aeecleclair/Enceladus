import { AccountType } from "@/api";
import { getUsersSearchOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

interface UseUserSearchProps {
  query: string;
  includedAccountTypes?: AccountType[]; // Optional filter for account types
  excludedAccountTypes?: AccountType[]; // Optional filter for excluding account types
  includedGroups?: string[]; // Optional filter for groups
  excludedGroups?: string[]; // Optional filter for excluding groups
}

export const useUserSearch = ({
  query,
  includedAccountTypes,
  excludedAccountTypes,
  includedGroups,
  excludedGroups,
}: UseUserSearchProps) => {
  const { isTokenExpired } = useAuth();

  const {
    data: userSearch,
    refetch: refetchUsers,
    error,
    isLoading,
  } = useQuery({
    ...getUsersSearchOptions({
      query: {
        query: query.trim() || "*",
        includedAccountTypes: includedAccountTypes,
        excludedAccountTypes: excludedAccountTypes,
        includedGroups: includedGroups,
        excludedGroups: excludedGroups,
      },
    }),
    enabled: !isTokenExpired() && query.trim().length >= 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    userSearch,
    error,
    isLoading,
    refetchUsers,
  };
};
