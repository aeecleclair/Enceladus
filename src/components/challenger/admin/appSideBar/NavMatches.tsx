"use client";
import { useAllMatches } from "@/hooks/challenger/useAllMatches";
import { useRouter } from "@/i18n/navigation";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export function NavMatches() {
  const router = useRouter();
  const { allMatches } = useAllMatches();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/matches")}
          className="cursor-pointer hover:underline"
        >
          Matchs {(allMatches?.length ?? 0) > 0 && `(${allMatches!.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
