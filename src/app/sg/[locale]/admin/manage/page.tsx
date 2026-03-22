"use client"

import { ManageEventSidebar } from "@/components/sg/admin/Sidebar/ManageEventSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const ManagePage = () => {
    return (
        <SidebarProvider>
            <ManageEventSidebar/>
            <SidebarInset>
                <div>Liste des inscriptions</div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default ManagePage;