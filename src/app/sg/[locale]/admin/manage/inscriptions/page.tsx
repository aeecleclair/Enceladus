"use client";

import { ManageEventSidebar } from "@/components/sg/admin/Sidebars/ManageSidebar/ManageEventSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TicketSearch } from "@/components/sg/admin/ticketSearch/TicketSearch";
import { useSearchParams } from "next/navigation";

const InscriptionsPage = () => {
    const eventId = useSearchParams().get("eventId");

    return (
        <SidebarProvider>
            <ManageEventSidebar />
            <SidebarInset>
                <SidebarTrigger />
                <header>Inscriptions</header>
                <TicketSearch eventId={eventId} />
            </SidebarInset>
        </SidebarProvider>
    );
};

export default InscriptionsPage;