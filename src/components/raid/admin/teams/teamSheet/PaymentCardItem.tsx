import { RaidParticipant } from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentCardItemProps {
  participant: RaidParticipant;
  validateCallback: (participantId: string, callback: () => void) => void;
  validateTShirtCallback: (participantId: string, callback: () => void) => void;
}

export const PaymentCardItem = ({
  participant,
  validateCallback,
  validateTShirtCallback,
}: PaymentCardItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTShirtLoading, setIsTShirtLoading] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {participant.firstname} {participant.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          {participant.payment ? (
            <p className="w-full">{"L'inscription à été payée"}</p>
          ) : (
            <LoadingButton
              onClick={() => {
                setIsLoading(true);
                validateCallback(participant.id, () => {
                  setIsLoading(false);
                });
              }}
              isLoading={isLoading}
              className="w-full"
            >
              Valider le paiement de l&appos;inscription
            </LoadingButton>
          )}
          {participant.t_shirt_size && (
            <>
              {participant.t_shirt_payment ? (
                <p className="w-full">{"Le T-Shirt à été payée"}</p>
              ) : (
                <LoadingButton
                  onClick={() => {
                    setIsTShirtLoading(true);
                    validateTShirtCallback(participant.id, () => {
                      setIsTShirtLoading(false);
                    });
                  }}
                  isLoading={isTShirtLoading}
                  className="w-full"
                >
                  Valider le paiement du T-Shirt
                </LoadingButton>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
