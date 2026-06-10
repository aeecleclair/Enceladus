import { useAuth } from "../useAuth";

import { CompetitionGroupType } from "@/api";
import {
  deleteCompetitionGroupsGroupUsersUserIdMutation,
  getCompetitionGroupsGroupOptions,
  postCompetitionGroupsGroupUsersUserIdMutation,
} from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

interface UseGroupsProps {
  group?: CompetitionGroupType;
}

export const useGroups = ({ group }: UseGroupsProps) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: groups,
    refetch: refetchGroups,
    error,
  } = useQuery({
    ...getCompetitionGroupsGroupOptions({
      path: {
        group: group!,
      },
    }),
    enabled: !isTokenExpired() && !!group,
    retry: false,
    queryHash: "getGroups",
  });

  const { mutate: mutateCreateGroup, isPending: isCreateLoading } = useMutation(
    {
      ...postCompetitionGroupsGroupUsersUserIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout de l'utilisateur",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchGroups();
        toast({
          title: "Utilisateur ajouté",
          description: "L'utilisateur a été ajouté au groupe avec succès.",
        });
      },
    },
  );

  const createGroup = (userId: string, callback: () => void) => {
    return mutateCreateGroup(
      {
        path: {
          group: group!,
          user_id: userId,
        },
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateDeleteGroup, isPending: isDeleteLoading } = useMutation(
    {
      ...deleteCompetitionGroupsGroupUsersUserIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression de l'utilisateur",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        refetchGroups();
        toast({
          title: "Utilisateur supprimé",
          description: "L'utilisateur a été retiré du groupe avec succès.",
        });
      },
    },
  );

  const deleteGroup = (userId: string, callback: () => void) => {
    return mutateDeleteGroup(
      {
        path: {
          user_id: userId,
          group: group!,
        },
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  return {
    groups,
    createGroup,
    error,
    isCreateLoading,
    isDeleteLoading,
    deleteGroup,
    refetchGroups,
  };
};
