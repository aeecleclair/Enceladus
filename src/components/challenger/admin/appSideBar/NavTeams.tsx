"use client";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";
import { useAllTeams } from "@/hooks/challenger/useAllTeams";
import { useSports } from "@/hooks/challenger/useSports";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useHasChallengerPermission } from "@/hooks/challenger/useHasChallengerPermission";

export function NavTeams() {
  const router = useRouter();
  const { allTeams } = useAllTeams();
  const { sports } = useSports();
  const { isChallengerAdmin } = useHasChallengerPermission();

  const incompleteCount = useMemo(() => {
    if (!allTeams || !sports) return 0;
    const teamSizeMap = new Map(sports.map((s) => [s.id, s.team_size]));
    return allTeams.filter(
      (t) => (t.participants?.length ?? 0) < (teamSizeMap.get(t.sport_id) ?? 0),
    ).length;
  }, [allTeams, sports]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/teams")}
          className="cursor-pointer hover:underline flex items-center gap-1 flex-wrap"
        >
          Équipes {(allTeams?.length ?? 0) > 0 && `(${allTeams!.length})`}
          {isChallengerAdmin && incompleteCount > 0 && (
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
