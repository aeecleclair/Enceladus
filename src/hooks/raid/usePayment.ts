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

  const validatePayment = (participantUserId: string, callback: () => void) => {
    mutateValidatePayment(
      { path: { user_id: participantUserId } },
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
    participantUserId: string,
    callback: () => void,
  ) => {
    mutateValidateTShirtPayment(
      { path: { user_id: participantUserId } },
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
