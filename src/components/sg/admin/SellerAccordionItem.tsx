import { ToggleSeller } from "./ToggleSeller";

import { SellerComplete } from "@/api";
import { useGroups } from "@/hooks/useGroups";

import { useTranslations } from "next-intl";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SellerAccordionItemProps {
  sellers: SellerComplete[];
}

export const SellerAccordionItem = ({ sellers }: SellerAccordionItemProps) => {
  const t = useTranslations("siarnaq");
  const { groups } = useGroups();

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
        {groups.map((group) => (
          <ToggleSeller key={group.id} group={group} sellers={sellers} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};
