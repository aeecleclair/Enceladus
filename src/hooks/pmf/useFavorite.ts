import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "../useAuth";

export const useFavorite = (offerId: string) => {
  const [fav, setFav] = useState(false);

  // const { isTokenExpired } = useAuth();
  // const { toast } = useToast();
  // const t = useTranslations("pmf");
  // const { data, isLoading, refetch } = useQuery({
  //   ...getPmfOfferFavoriteIdOptions({
  //     path: { offer_id: offerId }
  //   }),
  //   retry: 3,
  //   enabled: !isTokenExpired(),
  // });

  // const { mutate: mutatePostFavoriteId, isPending: isPatchLoading } = useMutation({
  //   ...patchPmfOfferFavoriteIdMutation(),
  //   onSuccess: () => { },
  //   onError: (error) => {
  //     console.error(error);
  //     toast({
  //       title: "Erreur",
  //       description: "Une erreur est survenue, veuillez réessayer.",
  //       variant: "destructive",
  //     });
  //   },
  // })

  // const toggleFav = (fav: boolean, callback: () => void) => {
  //   mutatePostFavoriteId(
  //     { body: fav },
  //     { onSuccess: () => callback() }
  //   );
  // };
  // return {
  //   fav: data.fav || false,
  //   toggleFav,
  //   isLoading,
  //   isPatchLoading,
  //   refetch,
  // }

  const toggleFav = () => {
    setFav(!fav);
  };

  return {
    fav: fav,
    toggleFav,
  }
}