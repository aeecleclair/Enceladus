"use client";

import { ManageEventSidebar } from "@/components/sg/admin/Sidebars/ManageSidebar/ManageEventSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TicketSearch } from "@/components/sg/admin/ticketSearch/TicketSearch";
import { useSearchParams } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";

const InscriptionsPage = () => {
    const eventId = useSearchParams().get("eventId");

    return (
        <SidebarProvider>
            <ManageEventSidebar />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <Breadcrumb className=" flex justify-between w-full">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="line-clamp-1">
                                        Inscriptions
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                            <Button asChild variant="outline" className="mr-4">
                                <Link href={{ pathname: "/admin", query: eventId ? { eventId } : {} }}>Retour</Link>
                            </Button>                        </Breadcrumb>
                    </div>
                </header>
                <main className="flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                    <TicketSearch eventId={eventId} />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default InscriptionsPage;