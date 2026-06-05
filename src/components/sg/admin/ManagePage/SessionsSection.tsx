import { SessionSimple } from "@/api";
import { SessionRow } from "./SessionRow";

interface SessionsSectionProps {
    sessions: SessionSimple[];
}

export function SessionsSection({ sessions }: SessionsSectionProps) {
    return (
        <section className="rounded-xl shadow-md bg-background p-6 grid gap-4">
            <h2 className="text-base font-semibold">
                Sessions <span className="text-muted-foreground font-normal">({sessions.length})</span>
            </h2>
            {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune session.</p>
            ) : (
                <div className="grid gap-2">
                    {sessions.map((session) => (
                        <SessionRow key={session.id} session={session} />
                    ))}
                </div>
            )}
        </section>
    );
}
