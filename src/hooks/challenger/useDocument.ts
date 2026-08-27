import { useHasChallengerPermission } from "./useHasChallengerPermission";

import { getCompetitionParticipantsUsersUserIdCertificateOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

import axios from "axios";

export const useDocument = (userId: string | null) => {
  const backUrl: string =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr";
  const { token } = useAuth();
  const { isChallengerAdmin } = useHasChallengerPermission();
  const { toast } = useToast();

  const uploadDocument = (
    file: Blob,
    sportId: string,
    callback: () => void,
  ) => {
    const formData = new FormData();
    formData.append("certificate", file);
    axios
      .post(
        `${backUrl}/competition/participants/sports/${sportId}/certificate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status > 300) {
          console.error(response.data);
          toast({
            title: "Erreur lors de l'ajout du document",
            description:
              "Une erreur est survenue, veuillez réessayer plus tard",
            variant: "destructive",
          });
          return;
        }
        refetch();
        callback();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout du document",
          description:
            error.response?.data?.detail ||
            "Une erreur est survenue, veuillez réessayer plus tard",
          variant: "destructive",
        });
      });
  };

  const { data, refetch, isLoading } = useQuery({
    ...getCompetitionParticipantsUsersUserIdCertificateOptions({
      path: {
        user_id: userId!,
      },
    }),
    enabled: !!userId && isChallengerAdmin,
    queryHash: "getDocument " + userId,
  });

  return {
    uploadDocument,
    data: data as File | null,
    refetch,
    isLoading,
  };
};
