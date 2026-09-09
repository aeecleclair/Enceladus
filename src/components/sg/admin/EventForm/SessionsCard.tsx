import { CardTemplate } from "./CardTemplate"
import { StyledFormField } from "@/components/siarnaq/custom/StyledFormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import z from "zod";
import _sessionFormSchema from "@/forms/sg/sessionFormSchema";
import { UseFormReturn } from "react-hook-form";
import { useFormatter, useTranslations } from "next-intl";
import { DatePicker } from "@/components/common/DatePicker";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import type { StagedSession } from "./AddEditEventForm";

export const NEW_SESSION_ID = "__new__";

interface SessionsCardProps {
    form: UseFormReturn<z.infer<ReturnType<typeof _sessionFormSchema>>>;
    sessions: StagedSession[];
    /** Session en cours d'édition, `NEW_SESSION_ID` pour une création, `null` si tout est replié. */
    openId: string | null;
    onOpenChange: (id: string | null) => void;
    onRemove: (sessionId: string) => void;
    minDate?: Date;
    maxDate: Date | null;
    error?: string | null;
    disabled?: boolean;
}

export const SessionsCard = ({
    form,
    sessions,
    openId,
    onOpenChange,
    onRemove,
    minDate,
    maxDate,
    error,
    disabled = false,
}: SessionsCardProps) => {
    const t = useTranslations("sg.addEditSessionForm");
    const format = useFormatter();

    const formatDate = (value?: Date) =>
        value ? format.dateTime(value, { dateStyle: "medium", timeStyle: "short" }) : "-";

    const fields = (isEditing: boolean) => (
        <div className="grid gap-6 mt-4 px-3 pb-4">
            <div className="flex flex-row gap-2 w-full">
                <StyledFormField
                    form={form}
                    label={t("name")}
                    id="name"
                    input={(field) => <Input {...field} />}
                />
            </div>
            <div className="flex flex-row gap-2">
                <StyledFormField
                    form={form}
                    label={t("quota") + " " + t("optional")}
                    id="quota"
                    input={(field) => (
                        <Input
                            {...field}
                            type="number"
                            placeholder={t("unlimited")}
                            onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.valueAsNumber)}
                        />
                    )}
                />
                <StyledFormField
                    form={form}
                    label={t("user_quota") + " " + t("optional")}
                    id="user_quota"
                    input={(field) => (
                        <Input
                            {...field}
                            type="number"
                            placeholder={t("unlimited")}
                            onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.valueAsNumber)}
                        />
                    )}
                />
            </div>
            <div className="flex flex-row gap-2">
                <StyledFormField
                    form={form}
                    label={t("date")}
                    id="date"
                    input={(field) => (
                        <DatePicker
                            date={field.value}
                            setDate={field.onChange}
                            fromMonth={minDate ?? new Date(new Date().getFullYear(), 0)}
                            toMonth={maxDate ?? undefined} // Find fix later 
                            minDate={minDate}
                            maxDate={maxDate ?? undefined} // Find fix later 
                            defaultDate={field.value || minDate || new Date()}
                            withTime
                        />
                    )}
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(null)}>
                    Annuler
                </Button>
                <Button type="submit" disabled={disabled}>
                    {isEditing ? "Enregistrer la session" : "Ajouter la session"}
                </Button>
            </div>
        </div>
    );

    return (
        <CardTemplate>
            <div className="flex items-center justify-between px-3">
                <p className="font-medium">Sessions</p>
                <Button
                    type="button"
                    disabled={disabled}
                    onClick={() => onOpenChange(openId === NEW_SESSION_ID ? null : NEW_SESSION_ID)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une session
                </Button>
            </div>

            {error ? <div className="px-3 text-sm text-destructive">{error}</div> : null}

            {openId === NEW_SESSION_ID ? (
                <div className="rounded-md border bg-background mx-3">
                    <div className="px-3 pt-3 text-sm font-medium">Nouvelle session</div>
                    {fields(false)}
                </div>
            ) : null}

            <div className="grid gap-2 px-3">
                {sessions.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        Aucune session pour le moment.
                    </div>
                ) : (
                    sessions.map((session) => {
                        const isOpen = openId === session.id;
                        return (
                            <Collapsible
                                key={session.id}
                                open={isOpen}
                                onOpenChange={(open) => onOpenChange(open ? session.id : null)}
                                className="rounded-md border bg-background"
                            >
                                <div className="flex items-center gap-2 p-3">
                                    <CollapsibleTrigger className="flex flex-1 items-center gap-2 text-left">
                                        <ChevronDown
                                            className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                        />
                                        <div>
                                            <div className="font-medium">{session.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {formatDate(session.date)} · quota {session.quota || 0} · quota utilisateur{" "}
                                                {session.user_quota || 0}
                                            </div>
                                        </div>
                                    </CollapsibleTrigger>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Supprimer la session"
                                        onClick={() => onRemove(session.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                                <CollapsibleContent>{fields(true)}</CollapsibleContent>
                            </Collapsible>
                        );
                    })
                )}
            </div>
        </CardTemplate>
    );
};
