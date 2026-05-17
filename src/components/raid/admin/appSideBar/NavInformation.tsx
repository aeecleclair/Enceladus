"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";
import { Settings2 } from "lucide-react";
import { usePathname } from "next/navigation";

export function NavInformation() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname.startsWith("/admin/information");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => router.push("/admin/information")}
          isActive={isActive}
        >
          <Settings2 />
          <span>Informations</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
