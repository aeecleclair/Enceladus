
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
import { NavSessions } from "./NavSessions";
import { NavCategories } from "./NavCategories";
import { NavOverview } from "./NavOverview";


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
                <NavOverview />
                <NavInscriptions />
                <NavEdit />
                <NavSessions />
                <NavCategories />
            </SidebarContent>
        <SidebarFooter />
        </Sidebar>
    )
}