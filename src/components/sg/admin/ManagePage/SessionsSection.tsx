"use client";

import { SessionSimple } from "@/api";
import { SessionRow } from "./SessionRow";
import { Button } from "@/components/ui/button";

interface SessionsSectionProps {
    sessions: SessionSimple[];
    onEdit?: () => void;
}

export function SessionsSection({ sessions, onEdit }: SessionsSectionProps) {
    return (
        <section className="rounded-xl shadow-md bg-background p-6 grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold">
                    Sessions <span className="text-muted-foreground font-normal">({sessions.length})</span>
                </h2>
                <Button variant="outline" size="sm" className="mt-2" onClick={onEdit}>
                    Modifier les sessions
                </Button>
            </div>
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
