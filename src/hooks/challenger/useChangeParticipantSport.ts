import { patchCompetitionParticipantsSportsSportIdUsersUserIdMutation } from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/challenger/errorTyping";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useChangeParticipantSport = () => {
  const { toast } = useToast();

  const { mutate: mutateChangeParticipant, isPending: isChangeLoading } =
    useMutation({
      ...patchCompetitionParticipantsSportsSportIdUsersUserIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors du changement de sport",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
      onSuccess() {
        toast({
          title: "Sport modifié",
          description: "Le sport du participant a été modifié avec succès.",
        });
      },
    });

  const changeParticipantSport = (
    srcSportId: string,
    userId: string,
    body: { sport_id?: string; team_id?: string | null },
    callback: () => void,
  ) => {
    return mutateChangeParticipant(
      {
        path: { sport_id: srcSportId, user_id: userId },
        body,
      },
      { onSuccess: () => callback() },
    );
  };

  const changeParticipantTeam = (
    sportId: string,
    userId: string,
    teamId: string,
    callback: () => void,
  ) => {
    return mutateChangeParticipant(
      {
        path: { sport_id: sportId, user_id: userId },
        body: { team_id: teamId },
      },
      { onSuccess: () => callback() },
    );
  };

  return {
    changeParticipantSport,
    changeParticipantTeam,
    isChangeLoading,
  };
};
