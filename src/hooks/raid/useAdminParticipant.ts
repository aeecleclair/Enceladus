import { useHasRaidPermission } from "./useHasRaidPermission";

import { getRaidParticipantsUserIdOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

/**
 * Admin-only: fetch a single participant by user id.
 */
export const useAdminParticipant = (userId: string | null | undefined) => {
  const { isTokenExpired } = useAuth();
  const { isRaidAdmin } = useHasRaidPermission();

  const {
    data: participant,
    isLoading,
    refetch: refetchParticipant,
  } = useQuery({
    ...getRaidParticipantsUserIdOptions({ path: { user_id: userId ?? "" } }),
    enabled: !!userId && !isTokenExpired() && isRaidAdmin,
    retry: false,
  });

  return { participant, isLoading, refetchParticipant };
};
