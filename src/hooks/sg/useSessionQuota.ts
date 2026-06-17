import { useAuth } from "../useAuth";
import { getTicketingSessionsSessionIdQuotaOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

interface UseSessionProps {
  sessionId?: string;
}

export const useSessionQuota = ({ sessionId }: UseSessionProps) => {
    const { isTokenExpired } = useAuth();

    const { data, isLoading, refetch } = useQuery({
        ...getTicketingSessionsSessionIdQuotaOptions({
            path: {
                session_id: sessionId!,
            },
        }),
        retry: 3,
        enabled: !isTokenExpired(),
    });


    return {
        sessions: data || [],
        isLoading,
        refetch,
    }
  }
