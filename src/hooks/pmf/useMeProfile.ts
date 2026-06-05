import { getPmfMeProfileOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";


export const useMeProfile = () => {
  const { isTokenExpired } = useAuth();
  const t = useTranslations("pmf");
  const { data, isLoading, refetch } = useQuery({
    ...getPmfMeProfileOptions(),
    retry: 3,
    enabled: !isTokenExpired(),
  });

  return {
    profile: data || [],
    isLoading,
    refetch,
  };
};
