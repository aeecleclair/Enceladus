import { useAuth } from "../useAuth";
import { useHasRaidPermission } from "./useHasRaidPermission";

import { RaidParticipantBase, RaidParticipantUpdate } from "@/api";
import {
  getRaidParticipantsParticipantIdOptions,
  getRaidParticipantsParticipantIdQueryKey,
  patchRaidParticipantsParticipantIdMutation,
  postRaidParticipantsMutation,
} from "@/api/@tanstack/react-query.gen";
import { useParticipantStore } from "@/stores/raid/particpant";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useMeParticipant = () => {
  const { token, userId, isTokenExpired } = useAuth();
  const { toast } = useToast();
  const { isRaidAdmin } = useHasRaidPermission();
  const queryClient = useQueryClient();
  const { participant, setParticipant } = useParticipantStore();

  const participantsQueryKey = getRaidParticipantsParticipantIdQueryKey({
    path: { participant_id: userId! },
  });

  const {
    data: me,
    isLoading,
    isFetched,
    refetch,
  } = useQuery({
    ...getRaidParticipantsParticipantIdOptions({
      path: { participant_id: userId! },
    }),
    enabled:
      userId !== null && !isRaidAdmin && !isTokenExpired() && !participant,
    retry: 0,
  });

  const {
    mutate: mutateCreateParticipant,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
  } = useMutation({
    ...postRaidParticipantsMutation(),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Le participant a été créé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: participantsQueryKey });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la création du participant",
        description: "Une erreur est survenue, veuillez réessayer plus tard",
        variant: "destructive",
      });
    },
  });

  const createParticipant = (
    participant: RaidParticipantBase,
    callback: () => void,
  ) => {
    mutateCreateParticipant(
      {
        body: participant,
      },
      { onSuccess: () => callback() },
    );
  };

  const {
    mutate: mutateUpdateParticipant,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
  } = useMutation({
    ...patchRaidParticipantsParticipantIdMutation(),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Le participant a été mis à jour avec succès",
      });
      queryClient.invalidateQueries({ queryKey: participantsQueryKey });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erreur lors de la mise à jour du participant",
        description: "Une erreur est survenue, veuillez réessayer plus tard",
        variant: "destructive",
      });
    },
  });

  const updateParticipant = (
    participant: RaidParticipantUpdate,
    participantId: string,
    callback: () => void,
  ) => {
    mutateUpdateParticipant(
      {
        body: participant,
        path: {
          participant_id: participantId,
        },
      },
      {
        onSuccess: () => {
          refetch();
          callback();
        },
      },
    );
  };

  if (me !== undefined && participant !== me && token !== null) {
    setParticipant(me);
  }

  return {
    me: participant,
    isLoading,
    isFetched,
    refetch,
    createParticipant,
    isCreationSuccess,
    isCreationLoading,
    updateParticipant,
    isUpdateSuccess,
    isUpdateLoading,
  };
};
