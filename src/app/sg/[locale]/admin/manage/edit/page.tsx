"use client"

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { EditEventSidebar } from "@/components/sg/admin/Sidebars/EditEventSidebar";
import { AddEditEventForm } from "@/components/sg/admin/EventForm/AddEditEventForm";
import AddEventState from "@/infra/AddEventState";

const EditPage = () => {
    const searchParams = useSearchParams();
    const eventId = searchParams.get("eventId") ?? undefined;
    const initialStep = Math.min(Number(searchParams.get("step") ?? 0), 3);

    const [state, setState] = useState<AddEventState>({
        currentStep: initialStep,
        stepDone: initialStep,
        headerTitle: "Admin",
        headerSubtitle: "Création de l'évènement",
        allHeaderSubtitles: [
            "Création de l'évènement",
            "Ajout des sessions",
            "Ajout des catégories",
            "Récapitulatif",
        ],
        pageFields: {
            "Création de l'évènement": ["name", "open_date", "close_date", "quota", "user_quota"],
            "Ajout des sessions": ["name", "date", "quota", "user_quota"],
            "Ajout des catégories": [],
            "Récapitulatif": [],
        },
        onValidateCardActions: {
            "Création de l'évènement": (_values, _callback) => {},
            "Ajout des sessions": (_values, _callback) => {},
            "Ajout des catégories": (_values, _callback) => {},
            "Récapitulatif": (_values, _callback) => {},
        } as const,
    });

    return (
        <SidebarProvider>
            <EditEventSidebar state={state} />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="line-clamp-1">
                                        Modifier un événement
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <main className="flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                    {eventId ? (
                        <AddEditEventForm
                            state={state}
                            setState={setState}
                            isEdit={true}
                            eventId={eventId}
                            creatorId=""
                            initialStep={initialStep}
                        />
                    ) : (
                        <p className="text-sm text-muted-foreground">Aucun événement sélectionné.</p>
                    )}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default EditPage;
