import {
  postRaidParticipantParticipantIdPaymentMutation,
  postRaidParticipantParticipantIdTShirtPaymentMutation,
} from "@/api/@tanstack/react-query.gen";

import { useMutation } from "@tanstack/react-query";

export const usePayment = () => {
  const { mutate: mutateValidatePayment, isPending: isPaymentLoading } =
    useMutation({
      ...postRaidParticipantParticipantIdPaymentMutation(),
    });

  const validatePayment = (participantId: string, callback: () => void) => {
    mutateValidatePayment(
      {
        path: {
          participant_id: participantId,
        },
      },
      { onSuccess: () => callback() },
    );
  };

  const {
    mutate: mutateValidateTShirtPayment,
    isPending: isTshirtPaymentLoading,
  } = useMutation({
    ...postRaidParticipantParticipantIdTShirtPaymentMutation(),
  });

  const validateTShirtPayment = (
    participantId: string,
    callback: () => void,
  ) => {
    mutateValidateTShirtPayment(
      {
        path: {
          participant_id: participantId,
        },
      },
      { onSuccess: () => callback() },
    );
  };

  return {
    validatePayment,
    isPaymentLoading,
    validateTShirtPayment,
    isTshirtPaymentLoading,
  };
};
