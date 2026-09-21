import { HelloAssoButton } from "@/components/common/HelloAssoButton";
import { WarningDialog } from "@/components/common/WarningDialog";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { usePaymentUrl } from "@/hooks/raid/usePaymentUrl";
import { usePrice } from "@/hooks/raid/usePrice";
import { getSituationLabel } from "@/lib/raid/teamUtils";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("raid.participant.payment");
  const { me } = useMeParticipant();
  const { price } = usePrice();
  const { paymentUrl, isLoading, refetchUrl } = usePaymentUrl();
  const [isOpened, setIsOpened] = useState(false);
  const [isStudentWarningOpened, setIsStudentWarningOpened] = useState(false);
  const router = useRouter();
  if (!isLoading && !!paymentUrl) {
    router.push(paymentUrl.url);
  }
  if (me?.status === "cancelled") return null;
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
  const hasScholarship =
    !!me?.has_scholarship && me?.school_authorization?.validation === "accepted";
  const hasReducedPrice =
    !!hasScholarship || isStudent || isNotValidatedStudent;
  const mustPayTShirt =
    me?.t_shirt_size && !me?.t_shirt_payment && me?.t_shirt_size !== "None";

  return (
    <>
      <WarningDialog
        isOpened={isStudentWarningOpened}
        setIsOpened={setIsStudentWarningOpened}
        isLoading={isLoading}
        title={t("studentWarningTitle")}
        description={
          <>
            <div className="mt-6 mb-2 font-semibold">
              {t("studentWarningTitle")}
            </div>
            <p>{t("studentWarningDescription")}</p>
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
          >
            {t("pay")}
          </Button>
        }
      />
      <WarningDialog
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        isLoading={isLoading}
        title={t("title")}
        description={
          <div>
            <div className="my-2 font-semibold">{t("summary")}</div>
            <div className="space-y-2">
              {mustPayRegistering && (
                <div className="flex justify-between">
                  <span>{t("participation")}</span>
                  <span>
                    {((hasScholarship
                      ? price?.scholarship_price
                      : isStudent || isNotValidatedStudent
                        ? price?.student_price
                        : price?.external_price) ?? 0) / 100}{" "}
                    €
                  </span>
                </div>
              )}
              {mustPayTShirt && (
                <div className="flex justify-between">
                  <span>{t("tshirt", { size: me.t_shirt_size ?? "" })}</span>
                  <span>{(price?.t_shirt_price ?? 0) / 100} €</span>
                </div>
              )}
              {mustPayRegistering && mustPayTShirt && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span>{t("total")}</span>
                    <span>
                      {(((hasScholarship
                        ? price?.scholarship_price
                        : isStudent || isNotValidatedStudent
                          ? price?.student_price
                          : price?.external_price) ?? 0) +
                        (price?.t_shirt_price ?? 0)) /
                        100}{" "}
                      €
                    </span>
                  </div>
                </>
              )}
            </div>
            {mustPayRegistering && hasReducedPrice && (
              <div className="mt-4 text-sm text-muted-foreground">
                {t("priceReductionNotice")}
              </div>
            )}
            <div className="mt-6 mb-2 font-semibold">
              {t("paymentProviderInfo")}
            </div>
            <p>{t("helloAssoDescription")}</p>
          </div>
        }
        customButton={
          <HelloAssoButton isLoading={isLoading} onClick={() => refetchUrl()} />
        }
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
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
              {t("pay")}
            </Button>
          </TooltipTrigger>
          {!mustPayRegistering && (
            <TooltipContent>
              <p>{t("fullyValidated")}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </>
  );
};
