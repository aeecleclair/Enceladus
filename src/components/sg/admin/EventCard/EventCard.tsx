import { AppModulesTicketingSchemasTicketingEventComplete, EventSimple } from "@/api";
import classes from "./EventCard.module.css";
import {Card} from "@/components/ui/card";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface EventCardProps {
    event: EventSimple;
    canEdit?: boolean;
}

export function EventCard({ event, canEdit }: EventCardProps) {
    const relativeDate = formatDistanceToNow(new Date(event.open_date), {
        addSuffix: true,
        locale: fr,
    });

    return (
        <Card className={`${classes.eventCard} my-6`} onClick={() => console.log("Route to Sessions")}>
            <div className={classes.cardLink}>
                <div className={classes.imageContainer}>
                    <div className={classes.image} />
                    <div className={classes.imageOverlay} />
                    <div className={`${classes.statusBadge} ${classes['status-onsale']}`}>
                        {event.disabled ? "Disabled" : "On Sale"}
                    </div>
                    <div className={classes.dateBadge}>
                        <span className={classes.dateDay}>{format(new Date(event.open_date), "dd", { locale: fr })}</span>
                        <span className={classes.dateMonth}>{format(new Date(event.open_date), "MMM", { locale: fr }).toUpperCase()}</span>
                    </div>
                </div>

                <div className={classes.content}>
                    <div className={classes.contentMain}>
                        <h3 className={classes.title}>{event.name}</h3>
                        <div className={classes.meta}>
                            <p>Ouverture de la billetterie</p>
                            <span className={classes.eventDate}>{format(new Date(event.open_date), "dd/MM/yyyy", { locale: fr })}</span>
                            <span className={classes.relativeDate}>{relativeDate}</span>
                            <span className={classes.separator}>·</span>
                            <span className={classes.location}>{event.close_date ? format(new Date(event.close_date), "dd/MM/yyyy", { locale: fr }) : "N/A"}</span>
                        </div>
                        <div className={classes.footer}>
                            <span className={classes.organizer}>{event.organiser_id}</span>
                            <span className={`${classes.ticketStatus} ${classes['ticket-available']}`}>
                                3 ticket types
                            </span>
                        </div>
                    </div>

                    <div className={classes.statsPanel}>
                        <div className={classes.stat}>
                            <span className={classes.statValue}>{event.used_quota} / {event.quota}</span>
                            <span className={classes.statLabel}>Quotas</span>
                        </div>
                        <div className={classes.stat}>
                            <span className={classes.statValueRevenue}>0 €</span>
                            <span className={classes.statLabel}>Revenue</span>
                        </div>
                    </div>

                    <div className={classes.menuButton}>
                        {/* Menu button */}
                    </div>
                </div>
            </div>
        </Card>
    );
}
