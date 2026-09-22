import { SecurityFileBase } from "@/api";
import {
  getRaidParticipantsMeQueryKey,
  postRaidSecurityFileMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useToast } from "@/components/ui/use-toast";

export const useSecurityFile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isTokenExpired } = useAuth();
  const t = useTranslations("raid.team.securityFile");

  const invalidate = () => {
    const participantsQueryKey = getRaidParticipantsMeQueryKey({});
    if (participantsQueryKey) {
      queryClient.invalidateQueries({ queryKey: participantsQueryKey });
    }
    queryClient.invalidateQueries({ queryKey: ["raid"] });
  };

  const {
    mutate: mutateAssignSecurityFile,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
  } = useMutation({
    ...postRaidSecurityFileMutation(),
    onSuccess: () => {
      invalidate();
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: t("saveErrorTitle"),
        description: t("saveErrorDescription"),
        variant: "destructive",
      });
    },
  });

  const setSecurityFile = (
    securityFile: SecurityFileBase,
    participantId: string,
    callback: (securityFileId: string) => void,
    errorCallback?: () => void,
  ) => {
    if (isTokenExpired()) {
      errorCallback?.();
      return;
    }
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
        onError: () => {
          errorCallback?.();
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
