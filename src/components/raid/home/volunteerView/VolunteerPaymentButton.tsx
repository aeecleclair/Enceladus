"use client";

import { HelloAssoButton } from "@/components/common/HelloAssoButton";
import { WarningDialog } from "@/components/common/WarningDialog";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { useVolunteerPaymentUrl } from "@/hooks/raid/useVolunteerPaymentUrl";
import { usePrice } from "@/hooks/raid/usePrice";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const VolunteerPaymentButton = () => {
  const t = useTranslations("raid.volunteer.payment");
  const { meVolunteer } = useMeVolunteer();
  const { price } = usePrice();
  const { paymentUrl, isLoading, refetchUrl } = useVolunteerPaymentUrl();
  const [isOpened, setIsOpened] = useState(false);
  const router = useRouter();
  if (!isLoading && !!paymentUrl) {
    router.push(paymentUrl.url);
  }
  const mustPay = !meVolunteer?.payment;

  return (
    <>
      <WarningDialog
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        isLoading={isLoading}
        title={t("pay")}
        description={
          <div>
            <div className="my-2 font-semibold">{t("summary")}</div>
            <div className="space-y-2">
              {mustPay && (
                <div className="flex justify-between">
                  <span>{t("participation")}</span>
                  <span>
                    {(price?.volunteer_price ?? 0) / 100}{" "}
                    €
                  </span>
                </div>
              )}
            </div>
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
          <TooltipTrigger>
            <Button
              className="col-span-4 ml-auto w-25"
              disabled={!mustPay}
              onClick={() => {
                setIsOpened(true);
              }}
            >
              {t("pay")}
            </Button>
          </TooltipTrigger>
          {!mustPay && (
            <TooltipContent>
              <p>{t("fullyValidated")}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </>
  );
};
