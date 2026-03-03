import { OfferSimple } from "@/api";
import { useOffers } from "@/hooks/pmf/useOffers";
import { useTranslations } from "next-intl";
import OfferCard from "./OfferCard";

interface OffersPanelProps {
  globalFilter: string,
}
export default function OffersPanel({ globalFilter }: OffersPanelProps) {
  const t = useTranslations("pmf");
  const { offers } = useOffers();

  if (!offers) return null;
  return (
    <div className="items-center border">
      <p className="text-4xl font-bold items-center">{t("offersPanel.title")}</p>
      {offers.map((offer: OfferSimple) => (
        <OfferCard offer={offer} />
      ))}
    </div>
  );
};
