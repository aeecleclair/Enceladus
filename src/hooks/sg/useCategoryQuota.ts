import { useAuth } from "../useAuth";
import { getTicketingCategoriesCategoryIdQuotaOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

interface UseCategoryProps {
  categoryId?: string;
}

export const useCategoryQuota = ({ categoryId }: UseCategoryProps) => {
    const { isTokenExpired } = useAuth();

    const { data, isLoading, refetch } = useQuery({
        ...getTicketingCategoriesCategoryIdQuotaOptions({
            path: {
                category_id: categoryId!,
            },
        }),
        retry: 3,
        enabled: !isTokenExpired(),
    });


    return {
        categories: data || [],
        isLoading,
        refetch,
    }
  }
