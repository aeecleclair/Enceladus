import { PaymentCardItem } from "./PaymentCardItem";

import { RaidTeam } from "@/api";
import { useAdminTeam } from "@/hooks/raid/useAdminTeam";
import { usePayment } from "@/hooks/raid/usePayment";
import { useTeams } from "@/hooks/raid/useTeams";

import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface PaymentTabProps {
  team: RaidTeam;
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
    <div className="grid xl:grid-cols-2 gap-4 w-full py-6 grid-cols-1 max-md:p-8 max-md:gap-4">
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
        <Card className="w-full h-full">
          <CardContent className="w-full h-full mt-3">
            <span className="flex m-auto h-full justify-center items-center text-muted-foreground">
              {"Aucun coéquipier n'a été ajouté à cette équipe."}
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
