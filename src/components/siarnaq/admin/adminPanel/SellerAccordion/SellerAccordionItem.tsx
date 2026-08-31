import { ToggleSeller } from "./ToggleSeller";

import { SellerComplete, patchCdrSellersSellerId } from "@/api";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/components/reui/sortable";
import { useSellers } from "@/hooks/siarnaq/useSellers";
import { useGroups } from "@/hooks/useGroups";

import { useTranslations } from "next-intl";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";

import { GripVerticalIcon } from "lucide-react";

interface SellerAccordionItemProps {
  sellers: SellerComplete[];
}

export const SellerAccordionItem = ({ sellers }: SellerAccordionItemProps) => {
  const t = useTranslations("siarnaq");
  const { groups } = useGroups();
  const { toast } = useToast();
  const { refetch: refetchGroups } = useGroups();
  const { refetch: refetchSellers } = useSellers();

  const nonSellerGroups = groups.filter(
    (group) => !sellers.some((seller) => seller.group_id === group.id),
  );

  async function updateSellerOrder(sellerId: string, order: number) {
    const { error } = await patchCdrSellersSellerId({
      path: { seller_id: sellerId },
      body: {
        order: order,
      },
    });
    if (error) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      return;
    }
  }

  const handleValueChange = async (newValue: SellerComplete[]) => {
    console.log("New value:", newValue);
    for (let i = 0; i < newValue.length; i++) {
      const seller = newValue[i];
      if (seller.order !== i + 1) {
        await updateSellerOrder(seller.id, i + 1);
      }
    }
    refetchGroups();
    refetchSellers();
  };

  return (
    <AccordionItem value="association">
      <AccordionTrigger>
        <div className="flex flex-col items-start justify-between">
          <h3 className="text-lg font-semibold">
            {t("sellerAccordionItem.association")}
          </h3>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-2">
        <Sortable
          value={sellers}
          onValueChange={handleValueChange}
          getItemValue={(item) => item.id}
          strategy="vertical"
          className="space-y-2"
        >
          {sellers
            .sort((a, b) => a.order - b.order)
            .map((seller) => {
              const group = groups.find(
                (group) => group.id === seller.group_id,
              );
              if (!group) {
                return null;
              }
              return (
                <SortableItem key={seller.id} value={seller.id}>
                  <div
                    className="flex items-center gap-3 transition-colors"
                    onClick={() => {}}
                  >
                    <SortableItemHandle className="text-muted-foreground hover:text-foreground">
                      <GripVerticalIcon className="h-4 w-4" />
                    </SortableItemHandle>

                    <ToggleSeller group={group} sellers={sellers} />
                  </div>
                </SortableItem>
              );
            })}
        </Sortable>
        {nonSellerGroups.map((group) => (
          <ToggleSeller key={group.id} group={group} sellers={sellers} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};
