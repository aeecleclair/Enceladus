import { useAuth } from "../useAuth";
import { useHasChallengerPermission } from "./useHasChallengerPermission";

import { getCompetitionParticipantsUsersUserIdCertificateOptions } from "@/api/@tanstack/react-query.gen";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/challenger/errorTyping";

import { useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

import axios from "axios";

export const useDocument = (userId: string | null) => {
  const backUrl: string =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr";
  const { token, userId: currentUserId } = useAuth();
  const { isChallengerAdmin } = useHasChallengerPermission();
  const { toast } = useToast();

  /**
   * Resolves once the certificate is actually stored: the caller can await it
   * before moving on, otherwise leaving the page cancels the upload.
   * The callback is only run when the upload succeeded.
   */
  const uploadDocument = async (
    file: Blob,
    sportId: string,
    callback: () => void,
  ) => {
    const formData = new FormData();
    formData.append("certificate", file);
    try {
      await axios.post(
        `${backUrl}/competition/participants/sports/${sportId}/certificate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await refetch();
      callback();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur lors de l'ajout du document",
        description:
          (error as { response?: { data?: { detail?: string } } })?.response
            ?.data?.detail || DEFAULT_ERROR_MESSAGE,
        variant: "destructive",
      });
    }
  };

  const { data, refetch, isLoading } = useQuery({
    ...getCompetitionParticipantsUsersUserIdCertificateOptions({
      path: {
        user_id: userId!,
      },
    }),
    // A participant has to be able to read back their own certificate, not just
    // the admins reviewing it.
    enabled: !!userId && (isChallengerAdmin || userId === currentUserId),
    queryHash: "getDocument " + userId,
  });

  return {
    uploadDocument,
    data: data as File | null,
    refetch,
    isLoading,
  };
};
