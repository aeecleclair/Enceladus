import { getRaidVolunteersPayOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const useVolunteerPaymentUrl = () => {
  const {
    data: paymentUrl,
    isLoading,
    refetch: refetchUrl,
  } = useQuery({
    ...getRaidVolunteersPayOptions(),
    enabled: false,
    retry: 0,
  });

  return { paymentUrl, isLoading, refetchUrl };
};