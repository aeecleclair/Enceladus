import { getTicketingTicketsOptions, getTicketingEventsEventIdTicketsOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

export const useTickets = (eventId?: string | null) => {
    const { isTokenExpired } = useAuth();


    const { data, isLoading, refetch } = useQuery({
        ...getTicketingEventsEventIdTicketsOptions({
            path: {
                event_id: eventId ?? "",
            }

        }
          ),
        retry: 3,
        enabled: Boolean(eventId) && !isTokenExpired(),
    });

    return {
        tickets: data || [],
        isLoading,
        refetch
    };

}