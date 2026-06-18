import { useAuth } from "../useAuth";

import { RaidPrice } from "@/api";
import {
  getRaidPriceOptions,
  patchRaidPriceMutation,
} from "@/api/@tanstack/react-query.gen";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const usePrice = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

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
          title: "Succès",
          description: "Le prix a été mis à jour avec succès",
        });
        refetchPrice();
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la mise à jour",
          description: "Une erreur est survenue, veuillez réessayer.",
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
