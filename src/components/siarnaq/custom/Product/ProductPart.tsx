import { PurchaseItem, onValidate } from "./PurchaseItem";

import {
  AppModulesCdrSchemasCdrProductComplete,
  CdrUser,
  ProductCompleteNoConstraint,
} from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useProducts } from "@/hooks/siarnaq/useProducts";
import { useUserMemberships } from "@/hooks/siarnaq/useUserMemberships";
import { useUserPurchases } from "@/hooks/siarnaq/useUserPurchases";
import { usePathname } from "@/i18n/navigation";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface ProductPartProps {
  user: CdrUser;
  isAdmin?: boolean;
}

export const ProductPart = ({ user, isAdmin }: ProductPartProps) => {
  const tOnValidate = useTranslations("siarnaq.onValidate");
  const t = useTranslations("siarnaq");
  const format = useFormatter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { userMemberships: memberships } = useUserMemberships(user.id);
  const { purchases, total: totalToPay, refetch } = useUserPurchases(user.id);
  const { products: allProducts } = useProducts();

  const allConstraint = allProducts
    .map(
      (product: AppModulesCdrSchemasCdrProductComplete) =>
        product.product_constraints || [],
    )
    .flat();
  const allConstraintIds = allConstraint.map(
    (constraint: ProductCompleteNoConstraint) => constraint.id,
  );
  const userAssociationsMembershipsIds = memberships
    .filter(
      (membership) =>
        new Date(membership.end_date).getTime() >
        new Date(new Date().getFullYear(), 9, 30).getTime(),
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
              refetch,
              toast,
              tOnValidate,
            ),
          ),
      );
    } catch {
      toast({
        description: t("productPart.toastErrorDescription"),
        variant: "destructive",
      });
    } finally {
      refetch().then(({ data }) => {
        toast({
          title: data?.some(
            (purchase) =>
              purchase.product.needs_validation && !purchase.validated,
          )
            ? t("productPart.unvalidated")
            : t("productPart.validated"),
          variant: "default",
        });
      });

      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-10 -mt-4">
      <div className="grid gap-6 -mt-4">
        <div className="justify-between flex flex-row">
          <CardTitle>{t("productPart.summary")}</CardTitle>
          {isAdmin && pathname.startsWith(`/admin`) ? (
            <LoadingButton onClick={handleValidateAll} isLoading={isLoading}>
              {t("productPart.validateAll")}
            </LoadingButton>
          ) : null}
        </div>
        <div className="space-y-2">
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
                    allConstraintIds={allConstraintIds}
                    allPurchasesIds={purchases.map(
                      (purchase) => purchase.product.id,
                    )}
                    purchase={purchase}
                    userAssociationsMembershipsIds={
                      userAssociationsMembershipsIds
                    }
                    user={user}
                    isAdmin={isAdmin}
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
                    allConstraintIds={allConstraintIds}
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
                  />
                ))}
            </>
          ) : (
            <div>{t("productPart.noProduct")}</div>
          )}
        </div>
      </div>
    </div>
  );
};
