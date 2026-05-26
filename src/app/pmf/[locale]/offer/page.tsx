"use client";
import Footer from "@/components/common/Footer";
import OfferPanel from "@/components/pmf/user/OfferPanel";
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const searchParams = useSearchParams()
  const offerId = searchParams.get('offerId')
  if (!offerId) return null;
  return (
    <div>
      <OfferPanel offerId={offerId} />
      <Footer />
    </div>
  );
}
