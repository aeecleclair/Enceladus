import { EventSimple } from "@/api";
import { Card } from "@/components/ui/card";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useEventQuota } from "@/hooks/sg/useEventQuota";

interface EventCardProps {
  event: EventSimple;
  canEdit?: boolean;
}

export function EventCard({ event }: EventCardProps) {
  const { events: quota } = useEventQuota({ eventId: event.id });

  const relativeDate = formatDistanceToNow(new Date(event.open_date), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <Card
      className="group my-6 overflow-hidden border-input p-0! transition-shadow duration-200 @container min-w-70 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      onClick={() => console.log("Route to Sessions")}
    >
      <div className="flex min-h-35 [@container(max-width:768px)]:flex-col [@container(max-width:768px)]:min-h-0 [@container(max-width:768px)]:relative">
        {/* Image column */}
        <div className="relative w-[200px] min-w-[200px] overflow-hidden [@container(max-width:768px)]:w-full [@container(max-width:768px)]:min-w-full [@container(max-width:768px)]:h-[140px]">
          <div className="absolute inset-0 bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/15" />

          <div className="absolute top-[10px] left-[10px] flex items-center gap-[5px] rounded-sm bg-primary px-[10px] py-1 text-[10px] font-semibold uppercase tracking-[0.3px] text-white backdrop-blur-sm">
            {event.disabled ? "Disabled" : "On Sale"}
          </div>

          <div className="absolute bottom-[10px] left-[10px] flex min-w-[44px] flex-col items-center rounded-sm bg-white px-[10px] py-[6px] shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
            <span className="text-[18px] font-bold leading-none text-gray-900">
              {format(new Date(event.open_date), "dd", { locale: fr })}
            </span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.3px] text-primary">
              {format(new Date(event.open_date), "MMM", { locale: fr }).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content column */}
        <div className="flex flex-1 min-w-0 items-center gap-5 px-5 py-4 [@container(max-width:768px)]:flex-col [@container(max-width:768px)]:items-stretch [@container(max-width:768px)]:gap-3 [@container(max-width:768px)]:p-[14px]">
          <div className="flex flex-1 min-w-0 flex-col gap-1">
            <h3 className="m-0 line-clamp-2 text-[15px] font-semibold leading-[1.3] text-foreground transition-colors duration-150 group-hover:text-primary">
              {event.name}
            </h3>

            <div className="mt-[2px] flex flex-wrap items-center gap-[6px] text-[13px]">
              <p>Ouverture de la billetterie</p>
              <span className="font-medium text-foreground">
                {format(new Date(event.open_date), "dd/MM/yyyy", { locale: fr })}
              </span>
              <span className="text-muted-foreground">{relativeDate}</span>
              <span className="text-gray-300">·</span>
              <span className="max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
                {event.close_date
                  ? format(new Date(event.close_date), "dd/MM/yyyy", { locale: fr })
                  : "N/A"}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-[10px]">
              <span className="cursor-pointer text-[12px] text-muted-foreground hover:text-primary hover:underline">
                {event.organiser_id}
              </span>
              <span className="rounded-full bg-green-50 px-2 py-0.75 text-[11px] font-medium text-green-800">
                3 ticket types
              </span>
            </div>
          </div>

          {/* Stats panel */}
          <div className="flex shrink-0 items-center gap-6 rounded-md bg-gray-50 px-[18px] py-3 [@container(max-width:1024px)]:gap-[18px] [@container(max-width:1024px)]:px-[14px] [@container(max-width:1024px)]:py-[10px] [@container(max-width:768px)]:justify-around [@container(max-width:768px)]:p-3">
            <div className="flex min-w-[75px] cursor-default flex-col items-center gap-[3px] [@container(max-width:1024px)]:min-w-[65px]">
              <span className="text-[18px] font-bold leading-none text-foreground [@container(max-width:1024px)]:text-[16px]">
                {quota} / {event.quota}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.3px] text-muted-foreground">
                Quotas
              </span>
            </div>
            <div className="flex min-w-18.75 cursor-default flex-col items-center gap-[3px] [@container(max-width:1024px)]:min-w-[65px]">
              <span className="text-[18px] font-bold leading-none text-green-700 [@container(max-width:1024px)]:text-[16px]">
                0 €
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.3px] text-muted-foreground">
                Revenue
              </span>
            </div>
          </div>

          <div className="shrink-0 [@container(max-width:768px)]:absolute [@container(max-width:768px)]:top-[10px] [@container(max-width:768px)]:right-[10px]">
            {/* Menu button */}
          </div>
        </div>
      </div>
    </Card>
  );
}
