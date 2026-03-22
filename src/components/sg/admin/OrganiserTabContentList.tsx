// import { AdminPanel } from "./adminPanel/AdminPanel";
// import { RecapPanel } from "./adminPanel/RecapPanel/RecapPanel";
import { OrganiserTabContent } from "./OrganiserTabContent";

import { OrganiserComplete } from "@/api";
import { useCdrUser } from "@/hooks/siarnaq/useCdrUser";
import { useSellerProducts } from "@/hooks/siarnaq/useSellerProducts";
import { useEvents } from "@/hooks/sg/useEvents";

import { useSearchParams } from "next/navigation";

interface OrganiserTabContentListProps {
  organisers: OrganiserComplete[];
  isAdmin?: boolean;
}

export const OrganiserTabContentList = ({
  organisers,
  isAdmin,
}: OrganiserTabContentListProps) => {
  const searchParams = useSearchParams();
  const activeOrganiserId = searchParams.get("organiserId");
  const { events, refetch: refetchEvents } = useEvents();
  const userId = searchParams.get("userId");
  const { user, refetch } = useCdrUser(userId);

  // if (activeOrganiserId === "cdradmin" && isAdmin) {
  //   return <AdminPanel organisers={organisers} status={status} />;
  // }
  // if (activeOrganiserId === "cdrrecap" && isAdmin) {
  //   return user && <RecapPanel user={user} refetch={refetch} />;
  // }
  return organisers.map((organiser) => (
    <OrganiserTabContent
      key={organiser.id}
      organiser={organiser}
      events={events}
      refetchEvents={refetchEvents}
    />
  ));
};
