
import { getPmfMeOffersOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";


export const useMeOffers = () => {
  const { isTokenExpired } = useAuth();
  const t = useTranslations("pmf");
  const { data, isLoading, refetch } = useQuery({
    ...getPmfMeOffersOptions(),
    retry: 3,
    enabled: !isTokenExpired(),
  });

  return {
    userOffers: data || [],
    isLoading,
    refetch,
  };
};
