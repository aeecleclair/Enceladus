import { getRaidPayOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const usePaymentUrl = () => {
  const {
    data: paymentUrl,
    isLoading,
    refetch: refetchUrl,
  } = useQuery({
    ...getRaidPayOptions(),
    enabled: false,
    retry: 0,
  });

  return { paymentUrl, isLoading, refetchUrl };
};
