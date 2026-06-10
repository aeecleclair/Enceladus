"use client";
import { useSports } from "@/hooks/challenger/useSports";
import { useRouter } from "@/i18n/navigation";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export function NavPodiums() {
  const { sports } = useSports();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/podiums")}
          className="cursor-pointer hover:underline"
        >
          Podiums {(sports?.length ?? 0) > 0 && `(${sports!.length} sports)`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
