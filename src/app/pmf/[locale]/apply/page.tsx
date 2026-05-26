"use client"

import { useSearchParams } from 'next/navigation'
import Footer from "@/components/common/Footer";
// import { ApplyOfferButton } from "@/components/pmf/user/ApplyOfferButton";

export default function Page() {
  const searchParams = useSearchParams()
  const offerId = searchParams.get('offerId')

  return (
    <div>
      {/* <ApplyOfferButton offerId={offerId} /> */}
      <Footer />
    </div>
  )
}