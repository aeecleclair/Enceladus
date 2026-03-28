"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { Badge } from "../../ui/badge";
import { useRouter } from "next/navigation";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useSportMatches } from "@/src/hooks/useSportMatches";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useMemo, useState, useEffect } from "react";

export function NavMatches() {
  const router = useRouter();
  const { meParticipant } = useParticipant();
  const { sportMatches } = useSportMatches({
    sportId: meParticipant?.sport_id,
  });
  const { sportSchools } = useSportSchools();

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const { upcomingCount, imminentMatch } = useMemo(() => {
    if (!sportMatches || !meParticipant?.team_id)
      return { upcomingCount: 0, imminentMatch: null };

    const userMatches = sportMatches.filter(
      (m) =>
        (m.team1_id === meParticipant.team_id ||
          m.team2_id === meParticipant.team_id) &&
        m.date &&
        new Date(m.date).getTime() > now,
    );

    let imminent: { opponent: string; minutesUntil: number } | null = null;
    for (const m of userMatches) {
      const diff = Math.round(
        (new Date(m.date!).getTime() - now) / 60_000,
      );
      if (diff <= 30 && (!imminent || diff < imminent.minutesUntil)) {
        const opponentTeam =
          m.team1_id === meParticipant.team_id ? m.team2 : m.team1;
        const opponentSchool = sportSchools?.find(
          (s) => s.school_id === opponentTeam?.school_id,
        );
        const opponent = opponentSchool
          ? formatSchoolName(opponentSchool.school.name) ?? "Adversaire"
          : opponentTeam?.name ?? "Adversaire";
        imminent = { opponent, minutesUntil: diff };
      }
    }

    return { upcomingCount: userMatches.length, imminentMatch: imminent };
  }, [sportMatches, meParticipant?.team_id, now, sportSchools]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/matches")}
          className="cursor-pointer hover:underline flex items-center gap-1.5 flex-wrap"
        >
          Mes Matchs
          {imminentMatch ? (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-red-100 text-red-800 border-red-300 animate-pulse"
            >
              vs {imminentMatch.opponent} dans {imminentMatch.minutesUntil}min
            </Badge>
          ) : upcomingCount > 0 ? (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-800 border-blue-300"
            >
              {upcomingCount} à venir
            </Badge>
          ) : null}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
