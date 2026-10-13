import { PurchaseItem, onValidate } from "./PurchaseItem";

import { CdrUser } from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";
import { WarningDialog } from "@/components/common/WarningDialog";
import { useProducts } from "@/hooks/siarnaq/useProducts";
import { useUserMemberships } from "@/hooks/siarnaq/useUserMemberships";
import { useUserPayments } from "@/hooks/siarnaq/useUserPayments";
import { useUserPurchases } from "@/hooks/siarnaq/useUserPurchases";
import { usePathname } from "@/i18n/navigation";

import { useFormatter, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface ProductPartProps {
  user: CdrUser;
  isAdmin?: boolean;
}

export const ProductPart = ({ user, isAdmin }: ProductPartProps) => {
  const t = useTranslations("siarnaq");
  const format = useFormatter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { userMemberships: memberships } = useUserMemberships(user.id);
  const {
    purchases,
    total: totalToPay,
    refetch: refetchPurchases,
  } = useUserPurchases(user.id);
  const { products: allProducts } = useProducts();

  const { total: totalPaid } = useUserPayments(user.id);
  const normalizedTotalToPay = totalToPay ?? 0;
  const normalizedTotalPaid = totalPaid ?? 0;

  const totalPriceOfValidatedPurchases = useMemo(() => {
    return purchases
      .filter((purchase) => purchase.validated)
      .reduce(
        (acc, purchase) => acc + (purchase.quantity * purchase.price) / 100,
        0,
      );
  }, [purchases]);

  const userAssociationsMembershipsIds = memberships
    .filter(
      (membership) =>
        new Date(membership.end_date).getTime() >
        new Date(new Date().getFullYear(), 9, 15).getTime(),
    )
    .map((membership) => membership.association_membership_id);

  const handleValidateAll = async () => {
    setIsLoading(true);
    try {
      await Promise.all(
        purchases
          .filter(
            (purchase) =>
              !purchase.validated && purchase.product.needs_validation,
          )
          .map((purchase) =>
            onValidate(
              purchase.product_variant_id,
              purchase.validated,
              user.id,
              setIsLoading,
              refetchPurchases,
              toast,
              t,
            ),
          ),
      );
    } catch {
      toast({
        description: t("productPart.toastErrorDescription"),
        variant: "destructive",
      });
    } finally {
      refetchPurchases().then(({ data }) => {
        const notValidated = data?.some(
          (purchase) =>
            purchase.product.needs_validation && !purchase.validated,
        );
        toast({
          title: notValidated
            ? t("productPart.unvalidated")
            : t("productPart.validated"),
          variant: notValidated ? "destructive" : "default",
        });
      });

      setIsLoading(false);
    }
  };

  const remainingFunds = () => {
    return normalizedTotalPaid - totalPriceOfValidatedPurchases;
  };

  const priceOfPurchasesToValidate = () => {
    return purchases
      .filter((purchase) => !purchase.validated)
      .reduce(
        (acc, purchase) => acc + (purchase.quantity * purchase.price) / 100,
        0,
      );
  };

  const requestValidateAll = () => {
    if (priceOfPurchasesToValidate() > remainingFunds()) {
      setIsConfirmationOpen(true);
      return;
    }

    handleValidateAll();
  };

  return (
    <div className="grid gap-10 -mt-4">
      <div className="grid gap-6 -mt-4">
        <div className="justify-between flex flex-row">
          <CardTitle>{t("productPart.summary")}</CardTitle>
          {isAdmin && pathname.startsWith(`/admin`) ? (
            <LoadingButton onClick={requestValidateAll} isLoading={isLoading}>
              {t("productPart.validateAll")}
            </LoadingButton>
          ) : null}
        </div>
        <div className="space-y-2">
          {totalPriceOfValidatedPurchases}
          {purchases?.filter(
            (purchase) => purchase.product.needs_validation === true,
          )?.length > 0 ? (
            <>
              {purchases
                ?.filter(
                  (purchase) => purchase.product.needs_validation === true,
                )
                .map((purchase) => (
                  <PurchaseItem
                    key={purchase.product_variant_id}
                    allProducts={allProducts}
                    allPurchasesIds={purchases.map(
                      (purchase) => purchase.product.id,
                    )}
                    purchase={purchase}
                    userAssociationsMembershipsIds={
                      userAssociationsMembershipsIds
                    }
                    user={user}
                    isAdmin={isAdmin}
                    totalToPay={normalizedTotalToPay}
                    totalPaid={normalizedTotalPaid}
                    totalPriceOfValidatedPurchases={
                      totalPriceOfValidatedPurchases
                    }
                  />
                ))}
              <Separator className="my-2" />
              <div className="flex flex-row w-full">
                <span className="font-bold w-1/6">
                  {t("productPart.total")}
                </span>
                <span className="ml-auto font-semibold">
                  {totalToPay && format.number(totalToPay, "euro")}
                </span>
              </div>
            </>
          ) : (
            <div>{t("productPart.noProduct")}</div>
          )}
        </div>
      </div>
      <div className="grid gap-6 -mt-4">
        <div className="justify-between flex flex-row">
          <CardTitle>{t("productPart.interestSummary")}</CardTitle>
        </div>
        <div className="space-y-2">
          {purchases?.filter(
            (purchase) => purchase.product.needs_validation === false,
          )?.length > 0 ? (
            <>
              {purchases
                ?.filter(
                  (purchase) => purchase.product.needs_validation === false,
                )
                .map((purchase) => (
                  <PurchaseItem
                    key={purchase.product_variant_id}
                    allProducts={allProducts}
                    allPurchasesIds={purchases.map(
                      (purchase) => purchase.product.id,
                    )}
                    purchase={purchase}
                    userAssociationsMembershipsIds={
                      userAssociationsMembershipsIds
                    }
                    user={user}
                    isAdmin={isAdmin}
                    isInterest={true}
                    totalToPay={normalizedTotalToPay}
                    totalPaid={normalizedTotalPaid}
                    totalPriceOfValidatedPurchases={
                      totalPriceOfValidatedPurchases
                    }
                  />
                ))}
            </>
          ) : (
            <div>{t("productPart.noProduct")}</div>
          )}
        </div>
      </div>
      <WarningDialog
        isOpened={isConfirmationOpen}
        setIsOpened={setIsConfirmationOpen}
        isLoading={isLoading}
        title={t("productPart.insufficientPaymentTitle")}
        description={t("productPart.insufficientPayment", {
          totalPaid: format.number(normalizedTotalPaid, "euro"),
          totalPriceOfValidatedPurchases: format.number(
            totalPriceOfValidatedPurchases,
            "euro",
          ),
          remaining: format.number(
            priceOfPurchasesToValidate() - remainingFunds(),
            "euro",
          ),
        })}
        validateLabel={t("purchaseItem.confirm")}
        callback={() => {
          setIsConfirmationOpen(false);
          handleValidateAll();
        }}
      />
    </div>
  );
};
