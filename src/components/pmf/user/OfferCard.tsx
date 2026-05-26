import { OfferSimple } from "@/api";
import { useRouter } from "@/i18n/navigation";
import { DrawingPinFilledIcon, LapTimerIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

interface OfferCardProps {
  offer: OfferSimple;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const router = useRouter();
  const t = useTranslations("pmf");
  return (
    <div className="relative border border-gray-200 rounded-lg p-4">
      <span className="absolute right-4 top-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
        {offer.offer_type}
      </span>
      <p className="font-semibold mb-3">{offer.company_name}</p>
      <p className="font-bold text-3xl mb-3" onClick={() => router.push(`/offer?offerId=${offer.id}`)}>
        {offer.title}
      </p>
      <div className="flex items-center gap-10">
        <p className="flex items-center gap-2">
          {<LapTimerIcon />} {offer.duration} {t("OfferPanel.months")}
        </p>
        <p className="flex items-center gap-2">{<DrawingPinFilledIcon />}{offer.location}</p>
        <p>{new Date(offer.start_date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};