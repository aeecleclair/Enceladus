"use client";
import UserOffersPanel from "@/components/pmf/user/UserOffersPanel"
import Footer from "@/components/common/footer";
import { usePathname } from "@/i18n/navigation";

export default function Page() {
  const pathname = usePathname();
  return (
    <div>
      <UserOffersPanel userId={pathname} />
      <Footer />
    </div>
  );
}
