import { PageIndicator } from "../custom/PageIndicator";
import { ProductAccordion } from "../custom/productAccordion/ProductAccordion";

import { useCdrUser } from "@/hooks/siarnaq/useCdrUser";
import { useOnlineSellerProducts } from "@/hooks/siarnaq/useOnlineSellerProducts";
import { useOnlineSellers } from "@/hooks/siarnaq/useOnlineSellers";
import { useProductExpansionStore } from "@/stores/siarnaq/productExpansionStore";
import { useTokenStore } from "@/stores/token";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Accordion } from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ProductPanel = () => {
  const t = useTranslations("siarnaq");
  const { onlineSellers } = useOnlineSellers();
  const searchParams = useSearchParams();
  const firstSellerId =
    searchParams.get("sellerId") || onlineSellers?.at(0)?.id || "";
  const { onlineProducts } = useOnlineSellerProducts(firstSellerId);
  const seller = onlineSellers?.find((seller) => seller.id === firstSellerId);

  const { productExpansion, setExpandedProducts } = useProductExpansionStore();

  const { userId } = useTokenStore();
  const { user } = useCdrUser(userId);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      productExpansion[firstSellerId] === undefined &&
      seller?.id === firstSellerId &&
      onlineProducts &&
      onlineProducts.length > 0
    ) {
      setExpandedProducts(
        firstSellerId,
        onlineProducts.map((product) => product.id),
      );
    }
  }, [
    productExpansion,
    firstSellerId,
    setExpandedProducts,
    onlineProducts,
    seller?.id,
  ]);

  const availableProducts = onlineProducts.filter(
    (product) =>
      product?.variants?.filter(
        (variant) =>
          variant.allowed_curriculum?.filter(
            (curriculum) => curriculum.id === user?.curriculum?.id,
          )?.length ?? 0 > 0,
      )?.length ?? 0 > 0,
  );

  const customSellerNames = ["BDE", "BDS", "SDeC", "WEI"] as const;
  function isInCustomSellerNames(
    sellerName: string,
  ): sellerName is (typeof customSellerNames)[number] {
    return customSellerNames.includes(
      sellerName as (typeof customSellerNames)[number],
    );
  }
  const displaySellerName = (sellerName: string) =>
    isInCustomSellerNames(sellerName)
      ? t(`productPanel.${sellerName}`)
      : sellerName;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {seller
              ? displaySellerName(seller.name)
              : t("productPanel.noSellerFound")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableProducts.length > 0 ? (
            <Accordion
              type="multiple"
              value={productExpansion[firstSellerId]}
              onValueChange={(value) =>
                setExpandedProducts(firstSellerId, value)
              }
            >
              {availableProducts.map((product) => (
                <ProductAccordion
                  key={product.id}
                  product={product}
                  sellerId={seller?.id || ""}
                  userId={userId!}
                  showDescription
                  isSelectable
                  refreshProduct={() => {}}
                />
              ))}
            </Accordion>
          ) : (
            <h3 className="text-lg font-semibold">
              {t("productPanel.noProductFound")}
            </h3>
          )}
        </CardContent>
        <CardFooter className="px-6 py-4">
          <PageIndicator
            currentSellerId={firstSellerId}
            onlineSellers={onlineSellers}
          />
        </CardFooter>
      </Card>
    </div>
  );
};
