import { getRaidEditionsActiveOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

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
