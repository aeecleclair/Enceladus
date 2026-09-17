import { getRaidParticipantsOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";
import { useHasRaidPermission } from "@/hooks/raid/useHasRaidPermission";

import { useQuery } from "@tanstack/react-query";

export const useAdminParticipants = () => {
  const { isTokenExpired } = useAuth();
  const { isRaidAdmin } = useHasRaidPermission();

  const {
    data: participants,
    isLoading,
    refetch: refetchParticipants,
  } = useQuery({
    ...getRaidParticipantsOptions({}),
    enabled: isRaidAdmin && !isTokenExpired(),
    retry: false,
  });

  return { participants, isLoading, refetchParticipants };
};
