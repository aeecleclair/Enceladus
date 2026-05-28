import { OfferSimple } from "@/api";
import { useMeOffers } from "@/hooks/pmf/useMeOffers";
import { useTranslations } from "next-intl";
import OfferCard from "./OfferCard";

export default function MeOffersPanel() {
  const t = useTranslations("pmf");
  // Check account type, if former student useMeOffers, if student useFavorites
  // Might make the display of the favorite star account type dependent, also the text for my offers -> either published offers or favorite offers
  const { userOffers } = useMeOffers();

  if (!userOffers) return null;
  return (
    <div className="items-center border">
      <p className="text-4xl font-bold items-center">{t("offersPanel.title")}</p>
      {userOffers.map((offer: OfferSimple) => (
        <OfferCard offer={offer} />
      ))}
    </div>
  );
};
