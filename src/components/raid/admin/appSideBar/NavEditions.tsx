"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";
import { CalendarDays } from "lucide-react";
import { usePathname } from "next/navigation";

export function NavEditions() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname.startsWith("/admin/editions");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => router.push("/admin/editions")}
          isActive={isActive}
        >
          <CalendarDays />
          <span>Éditions</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
