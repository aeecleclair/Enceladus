"use client";

import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";

export function NavCategories() {
    const router = useRouter();

    const eventID = useSearchParams().get("eventId");

    function handleClick() {
        router.push(`manage/categories?eventId=${eventID}`);
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                <div onClick={handleClick} className="cursor-pointer hover:underline">
                    Categories
                </div>
                <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
                <ChevronRight />
                <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
            </SidebarGroupLabel>
        </SidebarGroup>
    );
}