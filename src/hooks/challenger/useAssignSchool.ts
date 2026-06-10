import { patchCompetitionUsersUserIdSchoolsMutation } from "@/api/@tanstack/react-query.gen";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useAssignSchool = () => {
  const { toast } = useToast();

  const { mutate: mutateAssignSchool, isPending: isAssignLoading } =
    useMutation({
      ...patchCompetitionUsersUserIdSchoolsMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'assignation",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess() {
        toast({
          title: "École assignée",
          description: "L'utilisateur a été assigné à l'école.",
        });
      },
    });

  const assignSchool = (
    userId: string,
    schoolId: string,
    callback: () => void,
  ) => {
    return mutateAssignSchool(
      {
        path: {
          user_id: userId,
        },
        body: schoolId,
      },
      { onSuccess: () => callback() },
    );
  };

  return {
    assignSchool,
    isAssignLoading,
  };
};
