import { getTicketingEventsCategoriesCountOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

export const useCategoriesCount = () => {
    const { isTokenExpired } = useAuth();


    const { data, isLoading, refetch } = useQuery({
        ...getTicketingEventsCategoriesCountOptions(),
        retry: 3,
        enabled: !isTokenExpired(),
    });

    return {
        categoriesCount: data || [],
        isLoading,
        refetch
    };

}