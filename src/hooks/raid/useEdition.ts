import { getRaidEditionsActiveOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

/**
 * Read-only access to the currently active raid edition.
 * For mutations (create / update / delete / inscription toggle), use useEditions.
 */
export const useEdition = () => {
  const { isTokenExpired } = useAuth();

  const {
    data: edition,
    isLoading,
    refetch: refetchEdition,
    error,
  } = useQuery({
    ...getRaidEditionsActiveOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  return {
    edition,
    error,
    isLoading,
    refetchEdition,
  };
};
