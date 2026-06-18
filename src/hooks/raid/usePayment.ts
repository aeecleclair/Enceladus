import {
  postRaidParticipantUserIdPaymentMutation,
  postRaidParticipantUserIdTShirtPaymentMutation,
} from "@/api/@tanstack/react-query.gen";

import { useMutation } from "@tanstack/react-query";

export const usePayment = () => {
  const { mutate: mutateValidatePayment, isPending: isPaymentLoading } =
    useMutation({
      ...postRaidParticipantUserIdPaymentMutation(),
    });

  const validatePayment = (participantId: string, callback: () => void) => {
    mutateValidatePayment(
      {
        path: {
          user_id: participantId,
        },
      },
      { onSuccess: () => callback() },
    );
  };

  const {
    mutate: mutateValidateTShirtPayment,
    isPending: isTshirtPaymentLoading,
  } = useMutation({
    ...postRaidParticipantUserIdTShirtPaymentMutation(),
  });

  const validateTShirtPayment = (
    participantId: string,
    callback: () => void,
  ) => {
    mutateValidateTShirtPayment(
      {
        path: {
          user_id: participantId,
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
