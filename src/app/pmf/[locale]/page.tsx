"use client";
import { useMeUser } from "@/hooks/useMeUser";
import OffersPanel from "@/components/pmf/user/OffersPanel"
import Footer from "@/components/common/footer";

export default function Page() {
  const { user } = useMeUser();
  console.log(user);
  return (
    <div>
      <OffersPanel />
      <Footer />
    </div>
  );
}
