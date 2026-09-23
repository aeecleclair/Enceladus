import { RaidPrice } from "@/api";
import {
  getRaidPriceOptions,
  patchRaidPriceMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useToast } from "@/components/ui/use-toast";

export const usePrice = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const t = useTranslations("raid.toast");

  const {
    data: price,
    isLoading,
    refetch: refetchPrice,
  } = useQuery({
    ...getRaidPriceOptions(),
    enabled: !isTokenExpired(),
    retry: 0,
  });

  const { mutate: mutateUpdatePrice, isPending: isUpdateLoading } = useMutation(
    {
      ...patchRaidPriceMutation({}),
      onSuccess: () => {
        toast({
          title: t("success"),
          description: t("priceUpdated"),
        });
        refetchPrice();
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: t("updateErrorTitle"),
          description: t("updateErrorDescription"),
          variant: "destructive",
        });
      },
    },
  );

  const updatePrice = (price: RaidPrice, callback: () => void) => {
    mutateUpdatePrice(
      {
        body: price,
      },
      { onSuccess: () => callback() },
    );
  };

  return {
    price,
    isLoading,
    refetchPrice,
    updatePrice,
    isUpdateLoading,
  };
};
