"use client";

import { ManageEventSidebar } from "@/components/sg/admin/Sidebars/ManageSidebar/ManageEventSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useTickets } from "@/hooks/sg/useTickets";
import { DataTable } from "@/components/sg/admin/DataTable";
import { useSearchParams } from "next/navigation";


const InscriptionsPage = () => {
    const eventId = useSearchParams().get("eventId");

    const { tickets, isLoading } = useTickets(eventId);

    console.log(tickets);


    return (
        <SidebarProvider>
            <ManageEventSidebar />
            <SidebarInset>
                <SidebarTrigger />
                <header>Inscriptions</header>
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
};

export default InscriptionsPage;