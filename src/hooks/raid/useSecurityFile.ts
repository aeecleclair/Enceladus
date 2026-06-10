import { SecurityFileBase } from "@/api";
import { postRaidSecurityFileMutation } from "@/api/@tanstack/react-query.gen";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useSecurityFile = () => {
  const { toast } = useToast();

  const {
    mutate: mutateAssignSecurityFile,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
  } = useMutation({
    ...postRaidSecurityFileMutation(), // Replace with the actual mutation function
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "La fiche de sécurité a été créée avec succès",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la création de la fiche de sécurité",
        description: "Une erreur est survenue, veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const setSecurityFile = (
    securityFile: SecurityFileBase,
    participantId: string,
    callback: (securityFileId: string) => void,
  ) => {
    mutateAssignSecurityFile(
      {
        body: securityFile,
        query: {
          participant_id: participantId,
        },
      },
      {
        onSuccess: (data) => {
          callback(data.id);
        },
      },
    );
  };

  return {
    setSecurityFile,
    isCreationLoading,
    isCreationSuccess,
  };
};
