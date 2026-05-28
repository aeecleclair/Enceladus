import { useOffer } from "@/hooks/pmf/useOffer";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useMeUser } from "@/hooks/useMeUser";
import { useRouter } from "@/i18n/navigation";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { useFavorite } from "@/hooks/pmf/useFavorite";
interface OfferPanelProps {
  offerId: string;
}

export default function OfferPanel({ offerId }: OfferPanelProps) {
  const t = useTranslations("pmf");
  const { offer } = useOffer(offerId);
  const { user } = useMeUser();
  const router = useRouter();
  const { fav, toggleFav } = useFavorite(offerId);
  if (!offerId) return null;
  if (!offer || Array.isArray(offer)) return null;

  return (
    <div>
      <div>
        <p className="font-bold text-3xl">{offer.title}</p>
        <p className="">{offer.company_name}</p>
        <p>{offer.duration} {t("OfferPanel.months")}</p>
        <p>{offer.location}</p>
        <p>{new Date(offer.created_on).toLocaleDateString()}</p>
        <p>{offer.location_type}</p>
        <p>{offer.offer_type}</p>
        <p>{new Date(offer.start_date).toLocaleDateString()}</p>
        <p>{offer.description}</p>
      </div>
      {fav ? <StarFilledIcon className="" onClick={() => toggleFav()} /> : <StarIcon className="" onClick={() => toggleFav()} />}
      {user?.id == offer.author_id ? (
        <Button variant="default" onClick={() => router.push(`/edit?offerId=${offerId}`)}>
          {t("OfferPanel.edit")}
        </Button>
      ) : (
        <Button variant="default" onClick={() => router.push(`/apply?offerId=${offerId}`)}>
          {t("OfferPanel.apply")}
        </Button>
      )}
    </div >
  );
};