import { deletePmfOffersOfferIdMutation, getPmfOffersOfferIdOptions, getPmfOffersOfferIdQueryKey, patchPmfOffersOfferIdMutation } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { OfferUpdate } from "@/api";

export const useOffer = (offerId:string) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const offerQueryKey = getPmfOffersOfferIdQueryKey({
    path: { offer_id: offerId },
  });

  const { data, isLoading, refetch } = useQuery({
    ...getPmfOffersOfferIdOptions({
      path: {offer_id:offerId}
  }),
    retry: 3,
    enabled: !isTokenExpired(),
  });

  const { mutate: mutatePatchOffer, isPending: isPatchLoading } = useMutation({
    ...patchPmfOffersOfferIdMutation(),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Offre modifiée avec succès"
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue, veuillez réessayer.",
        variant: "destructive",
      });
    },
  })

  const { mutate: mutateDeleteOffer, isPending: isDeleteLoading } = useMutation({
    ...deletePmfOffersOfferIdMutation({
      path: {offer_id:offerId}
  }),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "L'équipe a été supprimée avec succès",
      });
      queryClient.removeQueries({ queryKey: offerQueryKey });
    },
  });

  const patchOffer = (offer:OfferUpdate,callback: () => void) => {
    mutatePatchOffer(
      {body:offer,path:{offer_id:offerId}},
      { onSuccess: () => callback() }
    );
  };



  const deleteOffer = (callback: () => void) => {
    mutateDeleteOffer(
      { path: { offer_id: offerId } },
      { onSuccess: () => callback() }
    );
  };

  return {
    offer: data || [],
    isLoading,
    refetch,
    isPatchLoading,
    patchOffer,
    isDeleteLoading,
    deleteOffer,
  };
};
