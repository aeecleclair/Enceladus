"use client";

import { MembershipRecap } from "../../custom/MembershipRecap";
import { AddProductAccordionItem } from "./AddProductAccordionItem";

import {
  AppModulesCdrSchemasCdrProductComplete,
  SellerComplete,
  Status,
} from "@/api";
import { CustomDialog } from "@/components/common/CustomDialog";
import { ProductAccordion } from "@/components/siarnaq/custom/productAccordion/ProductAccordion";
import { useCdrUser } from "@/hooks/siarnaq/useCdrUser";
import { useYear } from "@/hooks/siarnaq/useYear";
import { useProductExpansionStore } from "@/stores/siarnaq/productExpansionStore";
import { useTokenStore } from "@/stores/token";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

import { format } from "date-fns";

interface SellerTabContentProps {
  status: Status;
  seller: SellerComplete;
  products: AppModulesCdrSchemasCdrProductComplete[];
  refetchProducts: () => void;
}

export const SellerTabContent = ({
  status,
  seller,
  products,
  refetchProducts,
}: SellerTabContentProps) => {
  const { toast } = useToast();
  const t = useTranslations("siarnaq");
  const searchParams = useSearchParams();
  const activeSellerId = searchParams.get("sellerId");
  const userId = searchParams.get("userId");
  const { user } = useCdrUser(userId);
  const { productExpansion, setExpandedProducts } = useProductExpansionStore();
  const { token } = useTokenStore();
  const { year } = useYear();
  const [isOpened, setIsOpened] = useState(false);

  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsOpened(false);
  }

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      productExpansion[seller.id] === undefined &&
      seller.id === activeSellerId &&
      products &&
      products.length > 0
    ) {
      setExpandedProducts(
        seller.id,
        products.map((product) => product.id),
      );
    }
  }, [
    productExpansion,
    seller.id,
    setExpandedProducts,
    products,
    activeSellerId,
  ]);

  const exportResult = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr"
        }/cdr/sellers/${seller.id}/results/`,
        {
          method: "GET",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Error while downloading");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const exportedAt = format(new Date(), "yyyy-MM-dd_HH-mm-ss");

      const link = document.createElement("a");
      link.href = url;
      link.download = `CdR_${year}_${seller.name}_${exportedAt}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      setIsOpened(false);
      return;
    }
    setIsOpened(false);
  };

  return (
    <TabsContent value={seller.id} className="min-w-96 w-full">
      <CustomDialog
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        title={t("sellerTabContent.exportData")}
        description={
          <div className="grid gap-6 mt-4">
            <div className="grid gap-2 text-justify">
              {t("sellerTabContent.exportDataExplanation")}
            </div>
            <div className="flex justify-end mt-2 space-x-4">
              <Button variant="outline" onClick={closeDialog} className="w-25">
                {t("sellerTabContent.cancel")}
              </Button>
              <Button className="w-25" type="button" onClick={exportResult}>
                {t("sellerTabContent.export")}
              </Button>
            </div>
          </div>
        }
      />
      {seller.name === "Adhésion" && user !== undefined && (
        <MembershipRecap user={user} />
      )}

      <div className="flex border-b">
        <AddProductAccordionItem
          seller={seller}
          refreshProduct={refetchProducts}
        />
        <Button className="w-25 m-4" onClick={() => setIsOpened(true)}>
          {t("sellerTabContent.export")}
        </Button>
      </div>

      {products.length > 0 ? (
        <Accordion
          type="multiple"
          value={productExpansion[seller.id]}
          onValueChange={(value) => setExpandedProducts(seller.id, value)}
        >
          {products.map((product) => (
            <ProductAccordion
              key={product.id}
              product={product}
              sellerId={seller.id}
              userId={userId!}
              canAdd={status.status !== "closed"}
              canEdit={true}
              canRemove={true}
              canDisable={status.status !== "closed"}
              refreshProduct={refetchProducts}
              isSelectable={status.status === "onsite"}
              isAdmin
            />
          ))}
        </Accordion>
      ) : (
        <div className="p-4 border border-border rounded-md">
          <h3 className="text-lg font-semibold">
            {t("sellerTabContent.noProductFound")}
          </h3>
        </div>
      )}
    </TabsContent>
  );
};
