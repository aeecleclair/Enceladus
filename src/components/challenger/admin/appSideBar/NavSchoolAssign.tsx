"use client";
import { useRouter } from "@/i18n/navigation";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export function NavSchoolAssign() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/school-assign")}
          className="cursor-pointer hover:underline"
        >
          Assignation école
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
