import { InviteToken } from "@/api";
import { getErrorKey } from "@/lib/raid/errorTyping";
import {
  postRaidTeamsJoinTokenMutation,
  postRaidTeamsTeamIdInviteMutation,
} from "@/api/@tanstack/react-query.gen";

import { useMutation } from "@tanstack/react-query";

import { useTranslations } from "next-intl";

import { useToast } from "@/components/ui/use-toast";

export const useInviteToken = () => {
  const { toast } = useToast();
  const tApi = useTranslations("raid.apiErrors");

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
      const key = getErrorKey(error);
      toast({
        title: tApi((key ?? "generic") as never),
        description: undefined,
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
      const key = getErrorKey(error);
      toast({
        title: tApi((key ?? "generic") as never),
        description: undefined,
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
