"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";
import { useAllTeams } from "@/src/hooks/useAllTeams";
import { useSports } from "@/src/hooks/useSports";
import { useUser } from "@/src/hooks/useUser";
import { useMemo } from "react";
import { Badge } from "../../ui/badge";

export function NavTeams() {
  const router = useRouter();
  const { allTeams } = useAllTeams();
  const { sports } = useSports();
  const { isAdmin } = useUser();

  const incompleteCount = useMemo(() => {
    if (!allTeams || !sports) return 0;
    const teamSizeMap = new Map(sports.map((s) => [s.id, s.team_size]));
    return allTeams.filter(
      (t) =>
        (t.participants?.length ?? 0) < (teamSizeMap.get(t.sport_id) ?? 0),
    ).length;
  }, [allTeams, sports]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/teams")}
          className="cursor-pointer hover:underline flex items-center gap-1 flex-wrap"
        >
          Équipes{" "}
          {(allTeams?.length ?? 0) > 0 && `(${allTeams!.length})`}
          {isAdmin() && incompleteCount > 0 && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-800 border-amber-300"
            >
              {incompleteCount} incomplètes
            </Badge>
          )}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
