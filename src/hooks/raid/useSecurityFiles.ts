import { getRaidSecurityFilesZipOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const useSecurityFiles = () => {
  const { refetch, isLoading } = useQuery({
    ...getRaidSecurityFilesZipOptions(),
    enabled: false,
    retry: 0,
  });

  return { isLoading, refetchSecurityFiles: refetch };
};
