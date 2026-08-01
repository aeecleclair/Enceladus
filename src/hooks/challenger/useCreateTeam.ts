import { postCompetitionTeamsMutation } from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/challenger/errorTyping";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useCreateTeam = () => {
  const { toast } = useToast();

  const { mutate: mutateCreateTeam, isPending: isCreateTeamLoading } =
    useMutation({
      ...postCompetitionTeamsMutation(),
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "L'équipe a été créée avec succès.",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la création de l'équipe",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
      },
    });

  const createTeam = (
    body: {
      name: string;
      sport_id: string;
      school_id: string;
      captain_id: string;
    },
    callback: (teamId: string) => void,
  ) => {
    return mutateCreateTeam(
      { body },
      {
        onSuccess: (data) => {
          callback(data.id);
        },
      },
    );
  };

  return {
    createTeam,
    isCreateTeamLoading,
  };
};
