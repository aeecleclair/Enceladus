"use client"

import { useRouter, useSearchParams } from "next/navigation";

import { ManageEventSidebar } from "@/components/sg/admin/Sidebars/ManageSidebar/ManageEventSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvent } from "@/hooks/sg/useEvent";
import { AppModulesTicketingSchemasTicketingEventComplete } from "@/api";
import { EventSummaryCard } from "@/components/sg/admin/ManagePage/EventSummaryCard";
import { SessionsSection } from "@/components/sg/admin/ManagePage/SessionsSection";
import { CategoriesSection } from "@/components/sg/admin/ManagePage/CategoriesSection";

const ManagePage = () => {
    const router = useRouter();
    const eventId = useSearchParams().get("eventId") ?? undefined;
    const { events: data, isLoading } = useEvent({ eventId: eventId || "" });

    const event = eventId
        ? (data as unknown as AppModulesTicketingSchemasTicketingEventComplete | undefined)
        : undefined;

    return (
        <SidebarProvider>
            <ManageEventSidebar />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="line-clamp-1">
                                        {event?.name ?? "Gestion de l'événement"}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <main className="flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col gap-6 bg-muted/40 p-4 md:p-10">
                    {!eventId ? (
                        <p className="text-sm text-muted-foreground">Aucun événement sélectionné.</p>
                    ) : isLoading ? (
                        <div className="grid gap-4">
                            <Skeleton className="h-28 w-full rounded-xl" />
                            <Skeleton className="h-40 w-full rounded-xl" />
                            <Skeleton className="h-40 w-full rounded-xl" />
                        </div>
                    ) : !event ? (
                        <p className="text-sm text-destructive">Événement introuvable.</p>
                    ) : (
                        <div className="grid gap-6">
                            <EventSummaryCard event={event} />
                            <SessionsSection
                                sessions={event.sessions}
                                onEdit={() => router.push(`manage/edit?eventId=${eventId}&editMode=true&step=1`)}
                            />
                            <CategoriesSection
                                categories={event.categories}
                                onEdit={() => router.push(`manage/edit?eventId=${eventId}&editMode=true&step=2`)}
                            />
                        </div>
                    )}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default ManagePage;
