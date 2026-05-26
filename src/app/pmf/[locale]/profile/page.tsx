"use client";
import Footer from "@/components/common/Footer";
import { usePathname } from "@/i18n/navigation";
import { ProfileEditPanel } from "@/components/pmf/user/ProfileEditPanel";

export default function Page() {
  const pathname = usePathname();
  return (
    <div>
      <p>Profil</p>
      <ProfileEditPanel />
      <Footer />
    </div>
  );
}
