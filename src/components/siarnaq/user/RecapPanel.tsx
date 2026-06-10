import { PageIndicator } from "../custom/PageIndicator";
import { PaymentPart } from "../custom/Payment/PaymentPart";
import { ProductPart } from "../custom/Product/ProductPart";
import { PaymentButton } from "./PaymentButton";

import { useOnlineSellers } from "@/hooks/siarnaq/useOnlineSellers";
import { useUserPayments } from "@/hooks/siarnaq/useUserPayments";
import { useUserPurchases } from "@/hooks/siarnaq/useUserPurchases";
import { useMeUser } from "@/hooks/useMeUser";
import { useTokenStore } from "@/stores/token";

import { useFormatter, useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export const RecapPanel = () => {
  const t = useTranslations("siarnaq");
  const format = useFormatter();

  const { userId } = useTokenStore();
  const { user } = useMeUser();
  const { purchases, total: totalToPay } = useUserPurchases(userId);
  const { total: totalPaid } = useUserPayments(userId);

  const { onlineSellers } = useOnlineSellers();

  const remainingToPay = (totalToPay || 0) - (totalPaid || 0);

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent className="space-y-2">
        {user && (
          <div className="flex flex-col gap-8">
            <ProductPart user={user} />
            <PaymentPart user={user} />

            <div className="flex items-center justify-around">
              {remainingToPay >= 0 && (
                <div className="italic">
                  {t("recap.remainingToPay")}{" "}
                  {format.number(remainingToPay, "euro")}
                </div>
              )}
              {purchases.length > 0 && remainingToPay > 0 && <PaymentButton />}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 py-4 ">
        <PageIndicator currentSellerId="recap" onlineSellers={onlineSellers} />
      </CardFooter>
    </Card>
  );
};
