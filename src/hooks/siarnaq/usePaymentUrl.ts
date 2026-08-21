import { postCdrPay } from "@/api";

import { useQuery } from "@tanstack/react-query";

export const usePaymentUrl = (targetUserId?: string) => {
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["paymentUrl", targetUserId],
    queryFn: () =>
      targetUserId
        ? postCdrPay({
            query: {
              target_user_id: targetUserId,
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
