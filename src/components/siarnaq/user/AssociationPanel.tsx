import { SellerComplete } from "@/api";
import { useUserPurchases } from "@/hooks/siarnaq/useUserPurchases";
import { Link } from "@/i18n/navigation";
import { useTokenStore } from "@/stores/token";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { HiOutlineClipboardList } from "react-icons/hi";
import {
  HiOutlineCalendar,
  HiOutlineEllipsisHorizontal,
  HiOutlineShoppingCart,
  HiOutlineSparkles,
} from "react-icons/hi2";

interface AssociationPanelProps {
  onlineSellers: SellerComplete[];
  canClick?: boolean;
  showSellerFeatureFlag?: boolean;
}

export const AssociationPanel = ({
  onlineSellers,
  canClick,
  showSellerFeatureFlag,
}: AssociationPanelProps) => {
  const t = useTranslations("siarnaq");
  const { userId } = useTokenStore();
  const searchParams = useSearchParams();
  const firstSellerId = searchParams.get("sellerId") || onlineSellers.at(0)?.id;
  const { purchases } = useUserPurchases(userId);
  const totalPurchases =
    purchases?.reduce<number>((acc, purchase) => acc + purchase.quantity, 0) ??
    0;

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
    <div>
      <div className="mx-auto grid w-full max-w-6xl gap-2 mb-6">
        <h1 className="text-3xl font-semibold">
          {t("associationPanel.associations")}
        </h1>
      </div>
      <nav className="grid gap-4 text-sm text-muted-foreground">
        <Link
          href="?sellerId=intro"
          className={`hover:text-primary ${
            firstSellerId === "intro" ? "font-semibold text-primary" : ""
          }`}
        >
          <div className="flex flex-row items-center">
            <HiOutlineSparkles className="h-4 w-4 mr-2" />
            {t("associationPanel.presentation")}
          </div>
        </Link>
        {showSellerFeatureFlag &&
          onlineSellers.map((seller) => {
            const purchasesCount =
              purchases.filter((purchase) => purchase.seller.id === seller.id)
                .length ?? 0;
            return (
              <Link
                key={seller.id}
                href={canClick ? `?sellerId=${seller.id}` : "#"}
                className={`hover:text-primary ${
                  seller.id === firstSellerId
                    ? "font-semibold text-primary"
                    : ""
                } ${!canClick ? "cursor-not-allowed" : ""}`}
              >
                <div className="flex flex-row items-center">
                  {purchasesCount > 0 ? (
                    <HiOutlineShoppingCart className="h-4 w-4 mr-2" />
                  ) : (
                    <HiOutlineEllipsisHorizontal className="h-4 w-4 mr-2" />
                  )}
                  {displaySellerName(seller.name)}
                  {purchasesCount > 0 && (
                    <>
                      <span className="ml-2">·</span>
                      <span className="ml-2">{purchasesCount}</span>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        <Link
          href={canClick ? `?sellerId=info` : "#"}
          className={`hover:text-primary ${
            firstSellerId === "info" ? "font-semibold text-primary" : ""
          } ${!canClick ? "cursor-not-allowed" : ""}`}
        >
          <div className="flex flex-row items-center">
            <HiOutlineCalendar className="h-4 w-4 mr-2" />
            {t("associationPanel.information")}
          </div>
        </Link>
        <Link
          href={canClick ? `?sellerId=recap` : "#"}
          className={`hover:text-primary ${
            firstSellerId === "recap" ? "font-semibold text-primary" : ""
          } ${!canClick ? "cursor-not-allowed" : ""}`}
        >
          <div className="flex flex-row items-center">
            <HiOutlineClipboardList className="h-4 w-4 mr-2" />
            {t("associationPanel.summary")}
            {totalPurchases > 0 && (
              <>
                <span className="ml-2">·</span>
                <span className="ml-2">{totalPurchases}</span>
              </>
            )}
          </div>
        </Link>
      </nav>
    </div>
  );
};
