import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { AdminSidebar } from "@/components/sg/admin/Sidebars/AdminSidebar";
import { Separator } from "@/components/ui/separator";


const FAQPage = () => {
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
                    This is the FAQ page
                </main>
            </SidebarInset>
        </SidebarProvider>
  );
};

export default FAQPage;