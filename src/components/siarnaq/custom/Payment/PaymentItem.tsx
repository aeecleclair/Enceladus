import UserDisplayName from "../displayName";

import {
  AppModulesCdrSchemasCdrPaymentComplete,
  CdrUser,
  PaymentType,
  deleteCdrUsersUserIdPaymentsPaymentId,
} from "@/api";
import { CustomDialog } from "@/components/common/CustomDialog";
import { LoadingButton } from "@/components/common/LoadingButton";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { BsLightningCharge } from "react-icons/bs";
import {
  HiOutlineArchiveBox,
  HiOutlineAtSymbol,
  HiOutlineCreditCard,
  HiTrash,
} from "react-icons/hi2";
import { HiOutlineBanknotes, HiOutlinePencilSquare } from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PaymentItemProps {
  payment: AppModulesCdrSchemasCdrPaymentComplete;
  refetch: () => void;
  user: CdrUser;
  isAdmin?: boolean;
}

export const PaymentItem = ({
  payment,
  refetch,
  user,
  isAdmin,
}: PaymentItemProps) => {
  const t = useTranslations("siarnaq");
  const format = useFormatter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const paymentIcon = (paymentType: PaymentType) => {
    switch (paymentType) {
      case "cash":
        return <HiOutlineBanknotes className="w-5 h-5 mr-2" />;
      case "check":
        return <HiOutlinePencilSquare className="w-5 h-5 mr-2" />;
      case "HelloAsso":
        return <HiOutlineAtSymbol className="w-5 h-5 mr-2" />;
      case "card":
        return <HiOutlineCreditCard className="w-5 h-5 mr-2" />;
      case "archived":
        return <HiOutlineArchiveBox className="w-5 h-5 mr-2" />;
      case "MyECLPay":
        return <BsLightningCharge className="w-5 h-5 mr-2" />;
    }
  };
  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsOpened(false);
  }

  async function onDelete() {
    setIsLoading(true);
    const { error } = await deleteCdrUsersUserIdPaymentsPaymentId({
      path: {
        user_id: payment.user_id,
        payment_id: payment.id,
      },
    });
    if (error) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setIsOpened(false);
    refetch();
  }

  return (
    <div className="flex flex-row w-full items-center" key={payment.id}>
      <span className="font-bold w-full flex items-center">
        {paymentIcon(payment.payment_type)}
        {t(`paymentPart.${payment.payment_type}`)}
      </span>
      <span className="ml-auto font-semibold w-28 flex justify-end">
        {format.number(payment.total / 100, "euro")}
      </span>
      {isAdmin && (
        <CustomDialog
          isOpened={isOpened}
          setIsOpened={setIsOpened}
          title={t("paymentPart.deletePayment")}
          description={
            <div className="grid gap-3">
              <span>
                {t.rich("paymentPart.areYouSure", {
                  name: () => <UserDisplayName user={user} />,
                  amount: () => (
                    <span className="font-bold">
                      {format.number(payment.total / 100, "euro")}
                    </span>
                  ),
                  type: () => (
                    <span className="font-bold">
                      {t(`paymentPart.${payment.payment_type}`)}
                    </span>
                  ),
                })}
              </span>
              <div className="flex justify-end mt-2 space-x-4">
                <Button
                  variant="outline"
                  onClick={closeDialog}
                  disabled={isLoading}
                  className="w-25"
                >
                  {t("paymentPart.cancel")}
                </Button>
                <LoadingButton
                  isLoading={isLoading}
                  className="w-25"
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                >
                  {t("paymentPart.delete")}
                </LoadingButton>
              </div>
            </div>
          }
        >
          <Button size="icon" variant="destructive" className="ml-4 h-8 w-9">
            <HiTrash className="w-5 h-5" />
          </Button>
        </CustomDialog>
      )}
    </div>
  );
};
