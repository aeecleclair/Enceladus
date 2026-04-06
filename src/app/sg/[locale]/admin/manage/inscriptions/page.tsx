"use client"

import { ManageEventSidebar } from "@/components/sg/admin/Sidebars/ManageSidebar/ManageEventSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useTickets } from "@/hooks/sg/useTickets";


const InscriptionsPage = () => {
    const { tickets, isLoading } = useTickets();


    return (
        <SidebarProvider>
            <ManageEventSidebar/>
            <SidebarInset>
                <SidebarTrigger />
                <header>
                    Inscriptions
                </header>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <ul>
                        {tickets.map((ticket) => (
                            <li key={ticket.id}>{ticket.user_id} event_id: {ticket.event_id}</li>
                        ))}
                    </ul>
                )}

            </SidebarInset> 
        </SidebarProvider>
    );
}

export default InscriptionsPage;