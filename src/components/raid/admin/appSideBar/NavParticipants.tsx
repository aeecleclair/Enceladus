"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";
import { Users } from "lucide-react";
import { usePathname } from "next/navigation";

export function NavParticipants() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname.startsWith("/admin/participants");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => router.push("/admin/participants")}
          isActive={isActive}
        >
          <Users />
          <span>Participants</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
