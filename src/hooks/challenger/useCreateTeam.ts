import { postCompetitionTeamsMutation } from "@/api/@tanstack/react-query.gen";
import { useToast } from "@/components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";
import { useMutation } from "@tanstack/react-query";

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
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
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
