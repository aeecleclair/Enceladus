import { OfferSimple } from "@/api";

interface OfferCardProps {
    offer: OfferSimple;
}

export default function OfferCard({ offer }:OfferCardProps) {

    return (
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <p className="font-bold text-3xl">{offer.title}</p>
            <p className="">{offer.company_name}</p>
            <p>{offer.duration} mois</p>
            <p>{offer.location}</p>
            <p>{offer.location_type}</p>
            <p>{offer.offer_type}</p>
            <p>{new Date(offer.start_date).toLocaleDateString()}</p>
        </div>
    );
};