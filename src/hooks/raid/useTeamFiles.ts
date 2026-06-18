import { getRaidTeamFilesZipOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const useTeamFiles = () => {
  const { refetch, isLoading } = useQuery({
    ...getRaidTeamFilesZipOptions(),
    enabled: false,
    retry: 0,
  });

  return { isLoading, refetchTeamFiles: refetch };
};
