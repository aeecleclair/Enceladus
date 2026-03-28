import { getUsersSearchOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { useAuth } from "../useAuth";

interface UseUserSearchProps {
  query: string;
}

export const useUserSearch = ({ query }: UseUserSearchProps) => {
  const { isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

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
    enabled: isAdmin() && !isTokenExpired() && query.trim().length >= 0,
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
