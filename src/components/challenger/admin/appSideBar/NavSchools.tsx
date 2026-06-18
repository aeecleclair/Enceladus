"use client";
import { useSportSchools } from "@/hooks/challenger/useSportSchools";
import { useRouter } from "@/i18n/navigation";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export function NavSchools() {
  const { sportSchools } = useSportSchools();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/schools")}
          className="cursor-pointer hover:underline"
        >
          Écoles{" "}
          {(sportSchools?.length ?? 0) > 0 && `(${sportSchools!.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
