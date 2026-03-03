import { OfferBase } from "@/api";
import { getPmfOffersOptions, postPmfOffersMutation } from "@/api/@tanstack/react-query.gen";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export const useOffers = () => {
  const { isTokenExpired } = useAuth();
  const t = useTranslations("pmf");
  const { toast } = useToast();
  const { data, isLoading, refetch } = useQuery({
    ...getPmfOffersOptions(),
    retry: 3,
    enabled: !isTokenExpired(),
  });

  const { mutate: mutatePostOffer, isPending: isPostLoading } = useMutation({
    ...postPmfOffersMutation(),
    onSuccess: () => {
      toast({
        title: t("useOffers.postSuccessTitle"),
        description: t("useOffers.postSuccessDescription"),
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: t("useOffers.postErrorTitle"),
        description: t("useOffers.postErrorDescription"),
        variant: "destructive",
      });
    },
  });

  const postOffer = (offer:OfferBase,callback: () => void) => {
    mutatePostOffer(
      {body:offer},
      { onSuccess: () => callback() }
    );
  };

  return {
    offers: data || [],
    isLoading,
    isPostLoading,
    postOffer,
    refetch,
  };
};
