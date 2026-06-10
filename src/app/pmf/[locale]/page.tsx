"use client";
import OffersPanel from "@/components/pmf/user/OffersPanel";
import TestPage from "@/components/pmf/user/TestPage";
import { useMeUser } from "@/hooks/useMeUser";

export default function Page() {
  const { user } = useMeUser();
  console.log(user);
  return (
    <div>
      <p>
        Bienvenue {user?.firstname} {user?.name} sur PMF !
      </p>
      <TestPage />
      {<OffersPanel />}
    </div>
  );
}
