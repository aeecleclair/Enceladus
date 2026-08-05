import { postCompetitionPayMutation } from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/challenger/errorTyping";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const usePayment = () => {
  const { toast } = useToast();

  const { mutate: mutateGetPaymentUrl, isPending: isPaymentLoading } =
    useMutation({
      ...postCompetitionPayMutation(),
      onError: (error) => {
        toast({
          title: "Erreur lors de la création de l'URL de paiement",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
      onSuccess: (data) => {
        if (data?.url) {
          toast({
            title: "Redirection vers le paiement",
            description: "Vous allez être redirigé vers HelloAsso.",
          });
        }
      },
    });

  const getPaymentUrl = (callback: (paymentUrl: string) => void) => {
    return mutateGetPaymentUrl(
      {},
      {
        onSuccess: (data) => {
          if (data?.url) {
            callback(data.url);
          }
        },
      },
    );
  };

  return {
    getPaymentUrl,
    isPaymentLoading,
  };
};
