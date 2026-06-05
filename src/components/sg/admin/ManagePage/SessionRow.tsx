import { useFormatter, useTranslations } from "next-intl";
import { SessionSimple } from "@/api";

interface SessionRowProps {
    session: SessionSimple;
}

export function SessionRow({ session }: SessionRowProps) {
    const format = useFormatter();
    const t = useTranslations("sg"); // TODO : translate everything

    const formatDate = (value: string) =>
        format.dateTime(new Date(value), { dateStyle: "medium" });

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm">
            <div className="font-medium">{session.name}</div>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
                <span>{formatDate(session.date)}</span>
                <span>Quota : {session.used_quota ?? 0} / {session.quota ?? "∞"}</span>
                <span>Par utilisateur : {session.user_quota ?? "∞"}</span>
            </div>
        </div>
    );
}
