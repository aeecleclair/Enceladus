"use client";
import Footer from "@/components/common/footer";
import { usePathname } from "@/i18n/navigation";

export default function Page() {
  const pathname = usePathname();
  return (
    <div>
      <p>Profil</p>
      <profileEditPanel />
      <Footer />
    </div>
  );
}
