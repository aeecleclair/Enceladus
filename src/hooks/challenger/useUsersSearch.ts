import { useGetUsersSearch } from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";

interface UseUserSearchProps {
  query: string;
}

export const useUserSearch = ({ query }: UseUserSearchProps) => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const {
    data: userSearch,
    refetch: refetchUsers,
    error,
    isLoading,
  } = useGetUsersSearch(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      queryParams: {
        query: query.trim() || "*",
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired() && query.trim().length >= 0,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  return {
    userSearch,
    error,
    isLoading,
    refetchUsers,
  };
};
