"use client";

import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";

export function NavInscriptions() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const current = new URLSearchParams(Array.from(searchParams));
    console.log("current:", current);
    
    function handleClick(eventId: string) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        console.log("current:", current);
        current.set("eventId", eventId);
        const query = current.toString();
        router.push(`manage/inscriptions?${query}`);
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                <div onClick={() => handleClick("")} className="cursor-pointer hover:underline">
                    Liste des Inscriptions
                </div>
                <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
                    <ChevronRight />
                    <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
            </SidebarGroupLabel>
        </SidebarGroup>
    );
}