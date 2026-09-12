import { RaidParticipantRestricted } from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CheckCircle2, CreditCard, Shirt } from "lucide-react";

interface PaymentCardItemProps {
  participant: RaidParticipantRestricted;
  validateCallback: (participantId: string, callback: () => void) => void;
  validateTShirtCallback: (participantId: string, callback: () => void) => void;
}

const paidBadge = (
  <Badge
    variant="outline"
    className="gap-1 bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
  >
    <CheckCircle2 className="h-3 w-3" />
    Payé
  </Badge>
);

export const PaymentCardItem = ({
  participant,
  validateCallback,
  validateTShirtCallback,
}: PaymentCardItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTShirtLoading, setIsTShirtLoading] = useState(false);
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>
          {participant.user.firstname} {participant.user.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              Inscription
            </span>
            {participant.payment && paidBadge}
          </div>
          {!participant.payment && (
            <LoadingButton
              onClick={() => {
                setIsLoading(true);
                validateCallback(participant.user_id, () => {
                  setIsLoading(false);
                });
              }}
              isLoading={isLoading}
              className="w-full"
            >
              Valider le paiement de l&apos;inscription
            </LoadingButton>
          )}
        </div>

        {participant.t_shirt_size && (
          <div className="space-y-2 border-t border-border/60 pt-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Shirt className="h-4 w-4 text-muted-foreground" />
                T-shirt ({participant.t_shirt_size})
              </span>
              {participant.t_shirt_payment && paidBadge}
            </div>
            {!participant.t_shirt_payment && (
              <LoadingButton
                variant="outline"
                onClick={() => {
                  setIsTShirtLoading(true);
                  validateTShirtCallback(participant.user_id, () => {
                    setIsTShirtLoading(false);
                  });
                }}
                isLoading={isTShirtLoading}
                className="w-full"
              >
                Valider le paiement du T-shirt
              </LoadingButton>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
