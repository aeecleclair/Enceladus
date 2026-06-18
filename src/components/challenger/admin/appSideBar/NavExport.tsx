"use client";
import { useRouter } from "@/i18n/navigation";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export function NavExport() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/exports")}
          className="cursor-pointer hover:underline"
        >
          Exports
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
