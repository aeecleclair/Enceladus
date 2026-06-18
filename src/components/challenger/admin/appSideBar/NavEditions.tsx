"use client";
import { useEditions } from "@/hooks/challenger/useEditions";
import { useRouter } from "@/i18n/navigation";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export function NavEditions() {
  const router = useRouter();
  const { editions } = useEditions();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/editions")}
          className="cursor-pointer hover:underline"
        >
          Éditions {(editions?.length ?? 0) > 0 && `(${editions?.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
