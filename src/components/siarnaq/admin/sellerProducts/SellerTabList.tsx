import { SellerComplete, Status } from "@/api";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SellerTabListProps {
  status: Status;
  sellers: SellerComplete[];
  isAdmin?: boolean;
}

export const SellerTabList = ({
  status,
  sellers,
  isAdmin,
}: SellerTabListProps) => {
  const t = useTranslations("siarnaq");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (sellerId: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("sellerId", sellerId);
    const query = current.toString();
    router.push(`admin?${query}`);
  };

  return (
    <TabsList className={`grid w-full grid-flow-row grid-cols-7`}>
      {sellers.map((seller) => (
        <TabsTrigger
          key={seller.id}
          value={seller.id}
          className="min-w-0 w-full"
          onClick={() => handleClick(seller.id)}
        >
          <span className="block w-full truncate">
            {seller.name}
          </span>
        </TabsTrigger>
      ))}
      {isAdmin && (
        <>
          <TabsTrigger
            key="cdradmin"
            value="cdradmin"
            className="w-full min-w-18"
            onClick={() => handleClick("cdradmin")}
          >
            {t("productPart.admin")}
          </TabsTrigger>
          {(status.status == "online" || status.status === "onsite") && (
            <TabsTrigger
              key="cdrrecap"
              value="cdrrecap"
              className="w-full min-w-18"
              onClick={() => handleClick("cdrrecap")}
            >
              {t("productPart.summary")}
            </TabsTrigger>
          )}
        </>
      )}
    </TabsList>
  );
};
