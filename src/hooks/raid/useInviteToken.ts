import { InviteToken } from "@/api";
import {
  postRaidTeamsJoinTokenMutation,
  postRaidTeamsTeamIdInviteMutation,
} from "@/api/@tanstack/react-query.gen";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useInviteToken = () => {
  const { toast } = useToast();

  const {
    mutate: mutateCreateInviteToken,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
  } = useMutation({
    ...postRaidTeamsTeamIdInviteMutation(),
    onSuccess: (data) => {
      toast({
        title: "Invitation créée",
        description: "Le lien d'invitation a été créé avec succès",
      });
      return data;
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la création de l'invitation",
        description: "Une erreur est survenue, veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const createInviteToken = (
    teamId: string,
    callback: (token: InviteToken) => void,
  ) => {
    mutateCreateInviteToken(
      { path: { team_id: teamId } },
      {
        onSuccess: (data) => {
          callback(data);
        },
      },
    );
  };

  const {
    mutate: mutateJoinTeam,
    isPending: isJoinLoading,
    isSuccess: isJoinSuccess,
  } = useMutation({
    ...postRaidTeamsJoinTokenMutation(),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Vous avez rejoint l'équipe avec succès",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la jonction",
        description: "Une erreur est survenue, veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const joinTeam = (joinToken: string, callback: () => void) => {
    mutateJoinTeam(
      { path: { token: joinToken } },
      { onSuccess: () => callback() },
    );
  };

  return {
    createInviteToken,
    isCreationLoading,
    isCreationSuccess,
    joinTeam,
    isJoinLoading,
    isJoinSuccess,
  };
};
