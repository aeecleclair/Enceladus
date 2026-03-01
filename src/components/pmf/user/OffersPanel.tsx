import { OfferSimple } from "@/api";
import { useOffers } from "@/hooks/pmf/useOffers";
import { useTranslations } from "next-intl";

export default function OffersPanel() {
  const t = useTranslations("pmf");
  const { offers } = useOffers();

  if (!offers) return null;
  return (
    <div className="items-center border">
      <p className="text-4xl font-bold items-center">{t("offersPanel.title")}</p>
      {offers.map((offer: OfferSimple) => (
        <p key={offer.id}>offre {offer.title}</p>
      ))}
    </div>
  );
};
