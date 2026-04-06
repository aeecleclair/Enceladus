"use client"

import { ManageEventSidebar } from "@/components/sg/admin/Sidebars/ManageSidebar/ManageEventSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const EditPage = () => {
    return (
        <SidebarProvider>
            <ManageEventSidebar/>
            <SidebarInset>
                <SidebarTrigger />
                <header>
                    Edit Event
                </header>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default EditPage;