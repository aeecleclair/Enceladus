"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, usePathname } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Chevron } from "react-day-picker";

const items = [
    { href: "/admin/manage", label: "Overview" },
    { href: "/admin/manage/inscriptions", label: "Liste des Inscriptions" },
    { href: "/admin/manage/edit", label: "Modifier le SG", params: "&editMode=true" },
];

export function ManageEventSidebar({
    ...props
    }: React.ComponentProps<typeof Sidebar>) {

    const pathname = usePathname();
    const eventId = useSearchParams().get("eventId");

    return (
        <Sidebar className="pl-4" variant="inset" {...props}>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {items.map(({ href, label, params }) => (
                            <SidebarMenuItem key={href}>
                                <SidebarMenuButton asChild isActive={pathname.endsWith(href)}>
                                    <Link href={`${href}?eventId=${eventId ?? ""}${params ?? ""}`} className="w-full justify-between">
                                        {label}
                                        <ChevronRight />
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
