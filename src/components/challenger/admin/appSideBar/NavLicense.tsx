"use client";
import { useRouter } from "@/i18n/navigation";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export function NavLicense() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/license")}
          className="cursor-pointer hover:underline"
        >
          Validation des licenses
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
