"use client";

import { OrganiserTab } from "@/components/sg/admin/OrganiserTab";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/sg/admin/Sidebars/AdminSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";

interface EventProps {
    name: string;
    participants: number;
    status: string;
}

const AdminPage = () => {
    return (
        <SidebarProvider>
            <AdminSidebar/>
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
                    <h2 className="text-3xl">Evénements</h2>
                    <OrganiserTab/>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AdminPage;