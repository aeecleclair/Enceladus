import { HelloAssoButton } from "@/components/common/HelloAssoButton";
import { WarningDialog } from "@/components/common/WarningDialog";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { usePaymentUrl } from "@/hooks/raid/usePaymentUrl";
import { usePrice } from "@/hooks/raid/usePrice";
import { getSituationLabel } from "@/lib/raid/teamUtils";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const PaymentButton = () => {
  const { me } = useMeParticipant();
  const { price } = usePrice();
  const { paymentUrl, isLoading, refetchUrl } = usePaymentUrl();
  const [isOpened, setIsOpened] = useState(false);
  const [isStudentWarningOpened, setIsStudentWarningOpened] = useState(false);
  const router = useRouter();
  if (!isLoading && !!paymentUrl) {
    router.push(paymentUrl.url);
  }
  const mustPayRegistering = !me?.payment;
  const isStudent =
    ["centrale", "otherschool"].includes(
      getSituationLabel(me?.situation || undefined) || "",
    ) && me?.student_card?.validation === "accepted";
  const isNotValidatedStudent =
    ["centrale", "otherschool"].includes(
      getSituationLabel(me?.situation || undefined) || "",
    ) &&
    me?.student_card?.id !== undefined &&
    me?.student_card?.validation !== "accepted";
  const mustPayTShirt =
    me?.t_shirt_size && !me?.t_shirt_payment && me?.t_shirt_size !== "None";

  return (
    <>
      <WarningDialog
        isOpened={isStudentWarningOpened}
        setIsOpened={setIsStudentWarningOpened}
        isLoading={isLoading}
        title="Payer l'inscription"
        description={
          <>
            <div className="mt-6 mb-2 font-semibold">
              Votre carte étudiante n&apos;est pas encore validée !
            </div>
            <p>
              Votre carte étudiante n&apos;est pas encore validée, si vous
              procédez au paiement maintenant, vous payerez le tarif étudiant.
              Cependant, si votre carte est finalement refusée, il vous faudra
              repayer la différence entre le tarif étudiant et le tarif externe.
            </p>
          </>
        }
        customButton={
          <Button
            className="col-span-4 ml-auto w-25"
            disabled={!mustPayRegistering}
            onClick={() => {
              setIsOpened(true);
              setIsStudentWarningOpened(false);
            }}
          />
        }
      />
      <WarningDialog
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        isLoading={isLoading}
        title="Payer l'inscription"
        description={
          <div>
            <div className="my-2 font-semibold">Récapitulatif</div>
            <div className="space-y-2">
              {mustPayRegistering && (
                <div className="flex justify-between">
                  <span>Participation</span>
                  <span>
                    {(isStudent || isNotValidatedStudent
                      ? price?.student_price!
                      : price?.external_price!) / 100}{" "}
                    €
                  </span>
                </div>
              )}
              {mustPayTShirt && (
                <div className="flex justify-between">
                  <span>T-Shirt taille {me.t_shirt_size}</span>
                  <span>{price?.t_shirt_price! / 100} €</span>
                </div>
              )}
              {mustPayRegistering && mustPayTShirt && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>
                      {((isStudent || isNotValidatedStudent
                        ? price?.student_price!
                        : price?.external_price!) +
                        price?.t_shirt_price!) /
                        100}{" "}
                      €
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="mt-6 mb-2 font-semibold">
              Information sur le prestataire de paiement
            </div>
            <p>
              Vous allez être redirigé vers HelloAsso pour procéder au paiement
              de votre inscription. Ce service ne prend aucun frais sur les
              paiements, il se repose uniquement sur les dons. Par défaut,
              HelloAsso vous propose de faire un don. Si vous choississez de le
              faire, seul HelloAsso en bénéficiera.
            </p>
          </div>
        }
        customButton={
          <HelloAssoButton isLoading={isLoading} onClick={() => refetchUrl()} />
        }
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              className="col-span-4 ml-auto w-25"
              disabled={!mustPayRegistering}
              variant={isNotValidatedStudent ? "destructive" : "default"}
              onClick={() => {
                if (isNotValidatedStudent) {
                  setIsStudentWarningOpened(true);
                } else {
                  setIsOpened(true);
                }
              }}
            >
              Payer
            </Button>
          </TooltipTrigger>
          {!mustPayRegistering && (
            <TooltipContent>
              <p>Votre dossier est totalement validé !</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </>
  );
};
