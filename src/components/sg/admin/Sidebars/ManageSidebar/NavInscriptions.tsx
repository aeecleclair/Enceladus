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

    const eventId = useSearchParams().get("eventId");


    function handleClick() {
        router.push(`manage/inscriptions?eventId=${eventId}&editMode=true`);
    }


    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                <div onClick={() => handleClick()} className="cursor-pointer hover:underline">
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