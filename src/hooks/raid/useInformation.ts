import { RaidInformation } from "@/api";
import {
  getRaidInformationOptions,
  patchRaidInformationMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

export const useInformation = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const t = useTranslations("raid.toast");

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
          title: t("success"),
          description: t("informationUpdated"),
        });
        refetchInformation();
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: t("updateErrorTitle"),
          description: t("updateErrorDescription"),
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
