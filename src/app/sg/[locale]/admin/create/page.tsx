"use client";

import { useState } from "react";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useSessions } from "@/hooks/sg/useSessions";
import { CreateEventSidebar } from "@/components/sg/admin/Sidebars/CreateEventSidebar";
import { useTranslations } from "next-intl";
import AddEventState from "@/infra/AddEventState";
import { AddEditEventForm } from "@/components/sg/admin/EventForm/AddEditEventForm";



const CreatePage = () => {
    
    const [state, setState] = useState<AddEventState>({
        currentStep: 0,
        stepDone: 0,
        headerTitle: "Admin",
        headerSubtitle: "Création de l'évènement",
        allHeaderSubtitles: [
            "Création de l'évènement",
            "Ajout des sessions",
            "Ajout des catégories",
            "Récapitulatif"
        ],
        pageFields: {
            "Création de l'évènement": ["name", "open_date", "close_date", "quota", "user_quota"],
            "Ajout des sessions": ["name", "date", "quota", "user_quota"],
            "Ajout des catégories": [], // Add relevant fields if needed
            "Récapitulatif": [], // Add relevant fields if needed
        },
        onValidateCardActions: {
            "Création de l'évènement": (values, callback) => {},
            "Ajout des sessions": (values, callback) => {},
            "Ajout des catégories": (values, callback) => {},
            "Récapitulatif": (values, callback) => {},
        } as const
    });



    return (
        <SidebarProvider>
            <CreateEventSidebar state={state} />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                            <BreadcrumbPage className="line-clamp-1">
                                Billeterie
                            </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="ml-auto px-3">
                    </div>
                </header>
                <main className="flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                    <AddEditEventForm
                        state={state}
                        setState={setState}
                        creatorId={""}
                    />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default CreatePage;