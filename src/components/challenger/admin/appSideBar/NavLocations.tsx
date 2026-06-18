"use client";
import { useLocations } from "@/hooks/challenger/useLocations";
import { useRouter } from "@/i18n/navigation";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export function NavLocations() {
  const { locations } = useLocations();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/locations")}
          className="cursor-pointer hover:underline"
        >
          Lieux {(locations?.length ?? 0) > 0 && `(${locations!.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
