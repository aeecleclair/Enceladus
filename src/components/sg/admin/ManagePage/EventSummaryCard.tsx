import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { AppModulesTicketingSchemasTicketingEventComplete } from "@/api";
import { useEventQuota } from "@/hooks/sg/useEventQuota";
import { Button } from "@/components/ui/button";

interface EventSummaryCardProps {
    event: AppModulesTicketingSchemasTicketingEventComplete;
    onEdit?: () => void;
}

export function EventSummaryCard({ event, onEdit }: EventSummaryCardProps) {
    const {events: used_quota} = useEventQuota({ eventId: event.id });

    const format = useFormatter();
    const t = useTranslations("sg");

    const formatDate = (value?: string) => {
        if (!value) return "—";
        return format.dateTime(new Date(value), { dateStyle: "medium" });
    };

    return (
        <section className="rounded-xl shadow-md bg-background p-6 grid gap-3">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{event.name}</h2>
                {event.disabled && <Badge variant="destructive">Désactivé</Badge>}
                <Button variant="outline" size="sm" className="mt-2" onClick={onEdit}>
                    Modifier l'événement
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground sm:grid-cols-4">
                <div>
                    <div className="font-medium text-foreground">Ouverture</div>
                    {formatDate(event.open_date)}
                </div>
                <div>
                    <div className="font-medium text-foreground">Fermeture</div>
                    {formatDate(event.close_date ?? undefined)}
                </div>
                <div>
                    <div className="font-medium text-foreground">Quota</div>
                    {used_quota} / {event.quota ?? "∞"}
                </div>
                <div>
                    <div className="font-medium text-foreground">Quota par utilisateur</div>
                    {event.user_quota ?? "∞"}
                </div>
            </div>
        </section>
    );
}
