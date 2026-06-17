import { useAuth } from "../useAuth";
import { getTicketingEventsEventIdQuotaOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

interface UseEventProps {
  eventId?: string;
}

export const useEventQuota = ({ eventId }: UseEventProps) => {
    const { isTokenExpired } = useAuth();

    const { data, isLoading, refetch } = useQuery({
        ...getTicketingEventsEventIdQuotaOptions({
            path: {
                event_id: eventId!,
            },
        }),
        retry: 3,
        enabled: !isTokenExpired(),
    });


    return {
        events: data || [],
        isLoading,
        refetch,
    }
  }
