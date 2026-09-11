"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, usePathname } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { AdminSidebarFooter } from "./AdminSidebarFooter";

const items = [
    { href: "/admin", label: "Gérer mes SG" },
    { href: "/admin/faq", label: "FAQ" },
];

export function AdminSidebar({
    ...props
    }: React.ComponentProps<typeof Sidebar>) {

    const pathname = usePathname();

    return (
        <Sidebar className="pl-4" variant="inset" {...props}>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {items.map(({ href, label }) => (
                            <SidebarMenuItem key={href}>
                                <SidebarMenuButton asChild isActive={pathname.endsWith(href)}>
                                    <Link href={href} className="w-full justify-between">
                                        {label}
                                        <ChevronRight />
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <AdminSidebarFooter />
        </Sidebar>
    )
}
