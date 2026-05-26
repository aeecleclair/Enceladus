"use client"

import { useSearchParams } from 'next/navigation'
import Footer from "@/components/common/Footer";
import { EditOfferButton } from "@/components/pmf/user/EditOfferButton";

export default function Page() {
  const searchParams = useSearchParams()
  const offerId = searchParams.get('offerId')

  return (
    <div>
      <EditOfferButton offerId={offerId} />
      <Footer />
    </div>
  )
}