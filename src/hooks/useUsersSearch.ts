import { getUsersSearchOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useMeUser } from "./useMeUser";

interface UseUserSearchProps {
  query: string;
}

export const useUserSearch = ({ query }: UseUserSearchProps) => {
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
