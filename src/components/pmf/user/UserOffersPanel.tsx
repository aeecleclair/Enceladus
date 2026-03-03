import { OfferSimple } from "@/api";
import { useUserOffers } from "@/hooks/pmf/useUserOffers";
import { useTranslations } from "next-intl";
import OfferCard from "./OfferCard";

interface UserOffersPanelProps {
  userId: string;
}

export default function UserOffersPanel({ userId }: UserOffersPanelProps) {
  const t = useTranslations("pmf");
  const { userOffers } = useUserOffers(userId);

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
