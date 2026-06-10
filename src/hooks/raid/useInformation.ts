import { useAuth } from "../useAuth";

import { RaidInformation } from "@/api";
import {
  getRaidInformationOptions,
  patchRaidInformationMutation,
} from "@/api/@tanstack/react-query.gen";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useInformation = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: information,
    isLoading,
    refetch: refetchInformation,
  } = useQuery({
    ...getRaidInformationOptions({}),
    enabled: !isTokenExpired(),
    retry: 0,
  });

  const { mutate: mutateUpdateInformation, isPending: isUpdateLoading } =
    useMutation({
      ...patchRaidInformationMutation({}),
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Les informations ont été mises à jour avec succès",
        });
        refetchInformation();
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la mise à jour",
          description: "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
    });

  const updateInformation = (
    information: RaidInformation,
    callback: () => void,
  ) => {
    mutateUpdateInformation(
      { body: information },
      { onSuccess: () => callback() },
    );
  };

  return {
    information,
    isLoading,
    refetchInformation,
    updateInformation,
    isUpdateLoading,
  };
};
