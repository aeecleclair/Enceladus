"use client";
import { useSports } from "@/hooks/challenger/useSports";
import { useRouter } from "@/i18n/navigation";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export function NavPodiums() {
  const { activeSports } = useSports();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/podiums")}
          className="cursor-pointer hover:underline"
        >
          Podiums{" "}
          {(activeSports?.length ?? 0) > 0 &&
            `(${activeSports!.length} sports)`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
