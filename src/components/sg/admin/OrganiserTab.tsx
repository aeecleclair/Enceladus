import { OrganiserTabContentList } from "./OrganiserTabContentList";
import { OrganiserTabList } from "./OrganiserTabList";

import { useRouter } from "@/i18n/navigation";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useHasCdrPermission } from "@/hooks/siarnaq/useHasCdrPermission";
import { useGroups } from "@/hooks/useGroups";
import { useOrganisers } from "@/hooks/sg/useOrganisers";
import { Tabs } from "@/components/ui/tabs";



export const OrganiserTab = () => {
  const { isCdrAdmin } = useHasCdrPermission();
  const { organisers } = useOrganisers();
  const { groups } = useGroups();
  console.log("Groups data in OrganiserTab:", groups);
  const searchParams = useSearchParams();
  const router = useRouter();

  const firstSellerId =
    searchParams.get("organiserId") ||
    organisers.at(0)?.id ||
    (isCdrAdmin ? "cdradmin" : "");

  useEffect(() => {
    if (!searchParams.get("organiserId") && organisers.length > 0 && firstSellerId) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("organiserId", firstSellerId);
      const query = current.toString();
      router.replace(`admin?${query}`);
    }
  }, [firstSellerId, router, searchParams, organisers]);

  return (
    <div className="flex items-center justify-center p-6 min-w-96">
      {firstSellerId && (
        <Tabs defaultValue={firstSellerId} className="w-full">
          <OrganiserTabList
            organisers={organisers}
            isAdmin={isCdrAdmin}
          />
          <OrganiserTabContentList
            organisers={organisers}
            isAdmin={isCdrAdmin}
          />
        </Tabs>
      )}
    </div>
  );
};
