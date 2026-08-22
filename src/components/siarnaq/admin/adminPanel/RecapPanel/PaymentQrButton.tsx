import { CustomDialog } from "@/components/common/CustomDialog";
import { usePaymentUrl } from "@/hooks/siarnaq/usePaymentUrl";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { QRCodeSVG } from "qrcode.react";

interface PaymentQrButtonProps {
  targetUserId: string;
  userName: string;
  amount: number;
  disabled?: boolean;
}

export const PaymentQrButton = ({
  targetUserId,
  userName,
  amount,
  disabled,
}: PaymentQrButtonProps) => {
  const t = useTranslations("siarnaq");
  const format = useFormatter();
  const [isOpened, setIsOpened] = useState(false);

  const { paymentUrl, isError, isLoading, refetch } =
    usePaymentUrl(targetUserId);

  return (
    <CustomDialog
      isOpened={isOpened}
      setIsOpened={setIsOpened}
      title={t("recapPanel.paymentQrTitle")}
      description={
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="text-center">
            <p className="font-semibold">{userName}</p>
            <p className="text-lg font-bold">{format.number(amount, "euro")}</p>
          </div>

          {isLoading && <ReloadIcon className="h-6 w-6 animate-spin" />}

          {!isLoading && paymentUrl && (
            <div className="bg-white p-4">
              <QRCodeSVG
                value={paymentUrl.url}
                size={256}
                level="H"
                marginSize={4}
                imageSettings={{
                  src: "/eclair.svg",
                  height: 90,
                  width: 90,
                  excavate: true,
                }}
              />
            </div>
          )}

          {!isLoading && isError && <p>{t("recapPanel.paymentQrError")}</p>}
        </div>
      }
    >
      <Button
        disabled={disabled}
        onClick={() => {
          void refetch();
        }}
      >
        {t("recapPanel.paymentQr")}
      </Button>
    </CustomDialog>
  );
};
