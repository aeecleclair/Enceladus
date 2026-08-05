import { useAuth } from "./useAuth";

import { CoreUserUpdate } from "@/api";
import {
  getUsersMeOptions,
  patchUsersMeMutation,
} from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useMeUser = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: me,
    isLoading,
    refetch: refetchMe,
  } = useQuery({
    ...getUsersMeOptions(),
    enabled: !isTokenExpired(),
  });

  const { mutate: mutateUpdateUser, isPending: isUpdateLoading } = useMutation({
    ...patchUsersMeMutation(),
  });

  const updateUser = async (body: CoreUserUpdate, callback: () => void) => {
    return mutateUpdateUser(
      {
        body,
      },
      {
        onSuccess: () => {
          refetchMe();
          callback();
          toast({
            title: "Utilisateur mis à jour",
            description:
              "Les informations de l'utilisateur ont été mises à jour avec succès.",
          });
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: "Erreur lors de la mise à jour de l'utilisateur",
            description: getApiErrorMessage(error),
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    user: me,
    isLoading,
    updateUser,
    isUpdateLoading,
  };
};
