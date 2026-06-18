import {
  AppModulesCdrSchemasCdrProductComplete,
  AppModulesCdrSchemasCdrProductVariantComplete,
  CdrUser,
  HttpValidationError,
  ProductCompleteNoConstraint,
  PurchaseReturn,
  patchCdrUsersUserIdPurchasesProductVariantIdValidated,
} from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useUserPurchases } from "@/hooks/siarnaq/useUserPurchases";
import { useTranslation } from "@/translations/utils";

import { QueryObserverResult } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { HiCheck, HiOutlineExclamationCircle, HiXMark } from "react-icons/hi2";
import { HiOutlineCheckBadge } from "react-icons/hi2";

import { useToast } from "@/components/ui/use-toast";

interface PurchaseItemProps {
  purchase: PurchaseReturn;
  allProducts: AppModulesCdrSchemasCdrProductComplete[];
  allConstraintIds?: (string | undefined)[];
  allPurchasesIds?: string[];
  userAssociationsMembershipsIds?: string[];
  user: CdrUser;
  isAdmin?: boolean;
  isInterest?: boolean;
}

export const PurchaseItem = ({
  purchase,
  allProducts,
  allConstraintIds,
  allPurchasesIds,
  userAssociationsMembershipsIds,
  user,
  isAdmin,
  isInterest = false,
}: PurchaseItemProps) => {
  const t = useTranslations("siarnaq");
  const format = useFormatter();
  const { toast } = useToast();
  const { refetch } = useUserPurchases(user.id);
  const { selectTranslation } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const purchaseCompleteProduct = allProducts.find(
    (product) => product.id === purchase.product.id,
  );
  const missingConstraintProduct =
    purchaseCompleteProduct?.product_constraints?.filter((constraint) =>
      allConstraintIds?.includes(constraint.id),
    );

  const blockingConstraints = missingConstraintProduct?.filter((constraint) => {
    const isPurchased = allPurchasesIds?.includes(constraint.id);

    const constraintCompleteProduct = allProducts.find(
      (product) => product.id === constraint.id,
    );

    const hasMembership =
      constraintCompleteProduct?.related_membership &&
      userAssociationsMembershipsIds?.includes(
        constraintCompleteProduct.related_membership.id,
      );

    return !isPurchased && !hasMembership;
  });

  const displayWarning = blockingConstraints && blockingConstraints.length > 0;

  const variant = purchaseCompleteProduct?.variants?.find(
    (variant: AppModulesCdrSchemasCdrProductVariantComplete) =>
      variant.id === purchase.product_variant_id,
  );

  return (
    <div>
      <div className="flex flex-row w-full items-center">
        {!isInterest && (
          <span className="flex flex-col items-center md:flex-row">
            <span className="font-bold w-7">
              {displayWarning && (
                <HiOutlineExclamationCircle className="inline-block mr-2 h-5 w-5 text-destructive" />
              )}

              {purchase.validated && (
                <HiOutlineCheckBadge className="w-5 h-5 mr-4 text-green-700" />
              )}
            </span>

            <span className="font-bold w-11 pr-3 text-center md:text-right">
              {purchase.quantity} x
            </span>
          </span>
        )}

        <div className="flex flex-col md:flex-row w-3/4">
          <span className="font-bold md:w-1/3">{purchase.seller.name}</span>
          <span className="md:w-1/3">
            {selectTranslation(
              purchase.product.name_en,
              purchase.product.name_fr,
            )}
          </span>
          <span className="md:w-1/3">
            {selectTranslation(variant?.name_en, variant?.name_fr)}
          </span>
        </div>
        {!isInterest && (
          <span className="ml-auto w-24 text-right font-semibold">
            {format.number((purchase.quantity * purchase.price) / 100, "euro")}
          </span>
        )}

        {!isInterest && isAdmin && (
          <LoadingButton
            size="icon"
            variant="outline"
            className="ml-4 h-8 w-8"
            isLoading={isLoading}
            onClick={() =>
              onValidate(
                purchase.product_variant_id,
                purchase.validated,
                user.id,
                setIsLoading,
                refetch,
                toast,
                t,
              )
            }
          >
            {purchase.validated ? (
              <HiXMark className="w-5 h-5" />
            ) : (
              <HiCheck className="w-5 h-5" />
            )}
          </LoadingButton>
        )}
      </div>
      {displayWarning && (
        <div className="mt-1">
          <span className="text-red-500 font-semibold">
            {t("purchaseItem.missing", {
              products: blockingConstraints
                .map((product: ProductCompleteNoConstraint) =>
                  selectTranslation(product.name_en, product.name_fr),
                )
                .join(", "),
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export const onValidate = async (
  purchaseid: PurchaseReturn["product_variant_id"],
  purchaseState: PurchaseReturn["validated"],
  userid: CdrUser["id"],
  setIsLoading: (loading: boolean) => void,
  refetch: () => Promise<
    QueryObserverResult<PurchaseReturn[], HttpValidationError>
  >,
  toast: ReturnType<typeof useToast>["toast"],
  t: ReturnType<typeof useTranslations<"siarnaq">>,
) => {
  try {
    // useTranslations("onValidate") (don't remove!)
    setIsLoading(true);
    await patchCdrUsersUserIdPurchasesProductVariantIdValidated({
      path: {
        product_variant_id: purchaseid,
        user_id: userid,
      },
      query: {
        validated: !purchaseState,
      },
    });
    refetch().then(({ data }) => {
      toast({
        title: data
          ?.filter((purchase) => purchase.product_variant_id == purchaseid)
          .every((purchase) => purchase.validated)
          ? t("onValidate.validated")
          : t("onValidate.unvalidated"),
        variant: "default",
      });
    });
  } catch {
    toast({
      description: t("onValidate.toastErrorDescription"),
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
