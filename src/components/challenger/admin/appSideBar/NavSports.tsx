"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";
import { useSports } from "@/src/hooks/useSports";
import { useAllMatches } from "@/src/hooks/useAllMatches";
import { useAllTeams } from "@/src/hooks/useAllTeams";
import { useMemo } from "react";
import { Badge } from "../../ui/badge";

export function NavSports() {
  const { sports } = useSports();
  const { allMatches } = useAllMatches();
  const { allTeams } = useAllTeams();
  const router = useRouter();

  const { noTeams, noMatches } = useMemo(() => {
    if (!sports) return { noTeams: 0, noMatches: 0 };
    const withMatches = new Set(
      (allMatches ?? []).map((m) => m.sport_id),
    );
    const withTeams = new Set(
      (allTeams ?? []).map((t) => t.sport_id),
    );
    return {
      noTeams: sports.filter((s) => !withTeams.has(s.id)).length,
      noMatches: sports.filter((s) => !withMatches.has(s.id)).length,
    };
  }, [sports, allMatches, allTeams]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/sports")}
          className="cursor-pointer hover:underline flex items-center gap-1 flex-wrap"
        >
          Sports {(sports?.length ?? 0) > 0 && `(${sports!.length})`}
          {noTeams > 0 && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-800 border-amber-300"
            >
              {noTeams} sans équipes
            </Badge>
          )}
          {noMatches > 0 && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-800 border-amber-300"
            >
              {noMatches} sans matchs
            </Badge>
          )}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
