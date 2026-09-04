import { PaymentCardItem } from "./PaymentCardItem";

import { RaidTeamComplete } from "@/api";
import { useAdminTeam } from "@/hooks/raid/useAdminTeam";
import { usePayment } from "@/hooks/raid/usePayment";
import { useTeams } from "@/hooks/raid/useTeams";

import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface PaymentTabProps {
  team: RaidTeamComplete;
}

export const PaymentTab = ({ team }: PaymentTabProps) => {
  const { toast } = useToast();
  const { validatePayment, validateTShirtPayment } = usePayment();
  const { refetchTeam } = useAdminTeam(team.id);
  const { refetchTeams } = useTeams();

  function validateCallback(participantId: string, callback: () => void) {
    validatePayment(participantId, () => {
      callback();
      refetchTeam();
      refetchTeams();
      toast({
        title: "Paiement validé avec succès",
      });
    });
  }

  function validateTShirtCallback(participantId: string, callback: () => void) {
    validateTShirtPayment(participantId, () => {
      callback();
      refetchTeam();
      refetchTeams();
      toast({
        title: "Paiement du T-Shirt validé avec succès",
      });
    });
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
      <PaymentCardItem
        participant={team.captain}
        validateCallback={validateCallback}
        validateTShirtCallback={validateTShirtCallback}
      />
      {team.second ? (
        <PaymentCardItem
          participant={team.second}
          validateCallback={validateCallback}
          validateTShirtCallback={validateTShirtCallback}
        />
      ) : (
        <Card className="flex min-h-50 items-center justify-center border-dashed border-border/60 bg-muted/10">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Aucun coéquipier n&apos;a été ajouté à cette équipe.
          </CardContent>
        </Card>
      )}
    </div>
  );
};
