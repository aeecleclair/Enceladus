"use client";

import { AddEventAccordionItem } from "./AddEventAccordionItem";

import {
  OrganiserComplete,
  EventSimple,
  EventCategoriesCount,
} from "@/api";
import { useTokenStore } from "@/stores/token";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {  useState } from "react";

import { TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { EventCard } from "./EventCard/EventCard";
import { useRouter } from "@/i18n/navigation";


interface OrganiserTabContentProps {
  organiser: OrganiserComplete;
  events: EventSimple[];
  categoriesCount: EventCategoriesCount[];
  refetchEvents: () => void;
}

export const OrganiserTabContent = ({
  organiser,
  events,
  categoriesCount,
  refetchEvents,
}: OrganiserTabContentProps) => {
  const { toast } = useToast();
  const t = useTranslations("sg");
  const searchParams = useSearchParams();
  const activeSellerId = searchParams.get("organiserId");
  const userId = searchParams.get("userId");
  console.log("userId: ", userId);
  const { token } = useTokenStore();
  const [isOpened, setIsOpened] = useState(false);

  const router = useRouter();

  return (
    <TabsContent value={organiser.id} className="min-w-96 w-full">
      <div className="flex w-full border-b mb-4 pb-4">
        <AddEventAccordionItem
          organiserId={organiser.id}
        />
      </div>

      {events.length > 0 ? (
        <>
        {events.map((event) => (
          <div onClick={() => router.push(`/admin/manage?eventId=${event.id}`)}>
            <EventCard
              key={event.id}
              event={event}
              canEdit={true}
              categoryCount={categoriesCount.find((c) => c.event_id === event.id)?.categories_count ?? 0}
            />
          </div>
          ))
        }
        </>
      ) : (
        <div className="p-4 border border-border rounded-md">
          <h3 className="text-lg font-semibold">
            {t("organiserTabContent.noEventFound")}
          </h3>
        </div>
      )}
    </TabsContent>
  );
};
