import { postCdrPay } from "@/api";

import { useQuery } from "@tanstack/react-query";

export const usePaymentUrl = (userId?: string) => {
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["paymentUrl", userId],
    queryFn: () =>
      userId
        ? postCdrPay({
            query: {
              user_id: userId,
            },
          })
        : postCdrPay(),
    retry: 3,
    enabled: false,
  });

  return {
    paymentUrl: data?.data,
    isError,
    isLoading,
    refetch,
  };
};
