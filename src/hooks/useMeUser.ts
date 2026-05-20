import { useAuth } from "./useAuth";

import {
  getUsersMeOptions,
  patchUsersMeMutation,
} from "@/api/@tanstack/react-query.gen";
import { useToast } from "@/components/ui/use-toast";
import {
  APIErrorType,
  DetailedErrorType,
  ErrorType,
} from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

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

  const updateUser = async (body: any, callback: () => void) => {
    return mutateUpdateUser(
      {
        body,
      },
      {
        onSettled: (_data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la mise à jour de l'utilisateur",
              description:
                (error as unknown as APIErrorType)?.stack?.detail?.[0]?.msg ||
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            refetchMe();
            callback();
            toast({
              title: "Utilisateur mis à jour",
              description:
                "Les informations de l'utilisateur ont été mises à jour avec succès.",
            });
          }
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
