import {
  getCompetitionUsersMeGroupsOptions,
  getUsersMeOptions,
  patchUsersMeMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "../useAuth";
import { useToast } from "@/components/ui/use-toast";
import {
  ErrorType,
  DetailedErrorType,
  APIErrorType,
} from "@/lib/challenger/errorTyping";
import { useMutation, useQuery } from "@tanstack/react-query";

const COMPETITION_ADMIN_GROUP_ID = "2b1fc736-1288-4043-b293-14bc23adae68";
const SPORT_MANAGER = "sport_manager";
const SCHOOLS_BDS = "schools_bds";

export const useUser = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: me,
    isLoading,
    refetch: refetchMe,
  } = useQuery({
    ...getUsersMeOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  const { data: myCompetitionGroups } = useQuery({
    ...getCompetitionUsersMeGroupsOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  const isAdmin = () =>
    me?.groups?.some((group) => group.id === COMPETITION_ADMIN_GROUP_ID) ??
    false;

  const isBDS = () =>
    myCompetitionGroups?.some((group) => group.group === SCHOOLS_BDS) ?? false;

  const isSportManager = () =>
    myCompetitionGroups?.some((group) => group.group === SPORT_MANAGER) ??
    false;

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
    me,
    isLoading,
    isAdmin,
    isBDS,
    isSportManager,
    updateUser,
    isUpdateLoading,
  };
};
