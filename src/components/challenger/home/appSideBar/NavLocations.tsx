"use client";
import { useRouter } from "@/i18n/navigation";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export function NavLocations() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/locations")}
          className="cursor-pointer hover:underline"
        >
          Lieux
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
