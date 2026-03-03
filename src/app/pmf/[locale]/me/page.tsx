"use client";
import { useMeUser } from "@/hooks/useMeUser";
import MeOffersPanel from "@/components/pmf/user/MeOffersPanel"
import Footer from "@/components/common/footer";

export default function Page() {
  const { user } = useMeUser();
  if (!user) return null;
  return (
    <div>
      <MeOffersPanel />
      <Footer />
    </div>
  );
}
