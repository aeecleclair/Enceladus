import { patchCompetitionParticipantsSportsSportIdUsersUserIdLicenseMutation } from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/challenger/errorTyping";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useLicense = () => {
  const { toast } = useToast();

  const { mutate: mutateUpdateLicense, isPending: isUpdateLoading } =
    useMutation({
      ...patchCompetitionParticipantsSportsSportIdUsersUserIdLicenseMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la validation de la licence",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
      onSuccess() {
        toast({
          title: "Licence validée",
          description: "La licence a été validée avec succès.",
        });
      },
    });

  const updateLicense = (
    sport_id: string,
    user_id: string,
    is_license_valid: boolean,
    callback: () => void,
  ) => {
    return mutateUpdateLicense(
      {
        path: {
          sport_id,
          user_id,
        },
        query: {
          is_license_valid,
        },
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  return {
    updateLicense,
    isUpdateLoading,
  };
};
