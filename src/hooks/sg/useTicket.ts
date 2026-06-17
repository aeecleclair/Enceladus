import { getTicketingTicketsTicketIdOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

export const useTickets = (ticketId?: string | null) => {
    const { isTokenExpired } = useAuth();


    const { data, isLoading, refetch } = useQuery({
        ...getTicketingTicketsTicketIdOptions({
            path: {
                ticket_id: ticketId ?? "",
            }

        }
          ),
        retry: 3,
        enabled: Boolean(ticketId) && !isTokenExpired(),
    });

    return {
        tickets: data || [],
        isLoading,
        refetch
    };

}