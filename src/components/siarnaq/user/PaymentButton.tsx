import { HelloAssoButton } from "@/components/common/HelloAssoButton";
import { WarningDialog } from "@/components/common/WarningDialog";
import { usePaymentUrl } from "@/hooks/siarnaq/usePaymentUrl";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export const PaymentButton = () => {
  const t = useTranslations("siarnaq");
  const [isOpened, setIsOpened] = useState(false);
  const { paymentUrl, isLoading, refetch } = usePaymentUrl();
  const router = useRouter();
  if (!isLoading && !!paymentUrl) {
    router.push(paymentUrl.url);
  }
  return (
    <>
      <WarningDialog
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        isLoading={isLoading}
        title={t("paymentButton.pay")}
        description={
          <div>
            <div className="my-2 font-semibold">{t("paymentButton.title")}</div>
            <p>{t("paymentButton.description")}</p>
          </div>
        }
        customButton={
          <HelloAssoButton isLoading={isLoading} onClick={() => refetch()} />
        }
      />
      <Button
        className="col-span-4 ml-auto w-25"
        onClick={() => {
          setIsOpened(true);
        }}
      >
        {t("paymentButton.pay")}
      </Button>
    </>
  );
};
