
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavEdit } from "./NavEdit";
import { NavInscriptions } from "./NavInscriptions";


export function ManageEventSidebar({
    ...props
    }: React.ComponentProps<typeof Sidebar> & {
    }) {
    
    const t = useTranslations("sg.admin.sidebar");

    return (
        <Sidebar className="pl-4" variant="inset">
            <SidebarHeader >
                <SidebarMenu>
                    <SidebarMenuItem>
                        <a href="#">
                            <div className="grid flex-1 text-left text-sm leading-tight">
                            </div>
                        </a>
                    </SidebarMenuItem>
                </SidebarMenu>
            </ SidebarHeader >
            <SidebarContent>
                <NavEdit />
                <NavInscriptions />
                {/* <SidebarGroup />
                    <SidebarGroupLabel>
                        <div
                            onClick={handleManageSGClick}
                            className="cursor-pointer hover:underline"
                        >
                            Modifier le SG
                        </div>
                        <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                    </SidebarGroupLabel>
                    <SidebarGroupLabel>
                        <div
                            onClick={handleManageSGClick}
                            className="cursor-pointer hover:underline"
                        >
                            Liste des inscriptions
                        </div>
                        <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                    </SidebarGroupLabel>
                <SidebarGroup /> */}
            </SidebarContent>
        <SidebarFooter />
        </Sidebar>
    )
}