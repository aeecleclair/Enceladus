import { getTicketingTicketsOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

export const useTickets = () => {
    const { isTokenExpired } = useAuth();


    const { data, isLoading, refetch } = useQuery({
        ...getTicketingTicketsOptions(
          ),
        retry: 3,
        enabled: !isTokenExpired(),
    });

    return {
        tickets: data || [],
        isLoading,
        refetch
    };

}