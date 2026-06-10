"use client";
import { useRouter } from "@/i18n/navigation";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export function NavPodium() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/podiums")}
          className="cursor-pointer hover:underline"
        >
          Podiums
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
