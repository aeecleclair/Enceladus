import { postCompetitionPayMutation } from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

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
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: (data: any) => {
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
        onSuccess: (data: any) => {
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
