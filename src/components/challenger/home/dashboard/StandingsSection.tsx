"use client";

import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

interface PodiumEntry {
  school_id: string;
  total_points: number;
}

interface SportSchool {
  school_id: string;
  school: { name: string };
}

interface SelectedSchool {
  id: string;
  name: string;
  totalPoints: number;
  rank: number;
}

interface StandingsSectionProps {
  globalPodium: PodiumEntry[] | undefined;
  sportSchools: SportSchool[] | undefined;
  onSelectSchool: (school: SelectedSchool) => void;
}

const PODIUM_CONFIG = [
  {
    displayRank: 2,
    sourceIndex: 1,
    medal: "🥈",
    platformH: "h-16",
    bg: "from-slate-200 to-slate-100",
    border: "border-slate-300",
    numColor: "text-slate-500",
  },
  {
    displayRank: 1,
    sourceIndex: 0,
    medal: "🥇",
    platformH: "h-24",
    bg: "from-yellow-300 to-amber-200",
    border: "border-yellow-400",
    numColor: "text-yellow-700",
  },
  {
    displayRank: 3,
    sourceIndex: 2,
    medal: "🥉",
    platformH: "h-11",
    bg: "from-orange-300 to-orange-200",
    border: "border-orange-400",
    numColor: "text-orange-700",
  },
];

export const StandingsSection = ({
  globalPodium,
  sportSchools,
  onSelectSchool,
}: StandingsSectionProps) => {
  const sorted = [...(globalPodium ?? [])].sort(
    (a, b) => b.total_points - a.total_points,
  );
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const getSchool = (entry: PodiumEntry | undefined) =>
    sportSchools?.find((s) => s.school_id === entry?.school_id);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Classement des Écoles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sorted.length === 0 && (
          <div className="text-center py-6">
            <Trophy className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Aucun classement disponible pour le moment
            </p>
          </div>
        )}
        {/* Visual podium */}
        {top3.length > 0 && (
          <div className="flex items-end justify-center gap-2 pt-4">
            {PODIUM_CONFIG.map((cfg) => {
              const entry = top3[cfg.sourceIndex];
              const school = getSchool(entry);
              if (!entry || !school)
                return (
                  <div key={cfg.displayRank} className="flex-1 max-w-[120px]" />
                );
              return (
                <button
                  key={cfg.displayRank}
                  className="flex-1 max-w-[120px] flex flex-col items-center gap-1 group cursor-pointer"
                  onClick={() =>
                    onSelectSchool({
                      id: school.school_id,
                      name: school.school.name,
                      totalPoints: entry.total_points,
                      rank: cfg.displayRank,
                    })
                  }
                >
                  <span className="text-2xl">{cfg.medal}</span>
                  <p className="text-xs font-bold text-center leading-tight px-1 group-hover:underline line-clamp-2">
                    {formatSchoolName(school.school.name)}
                  </p>
                  <p className="text-[11px] font-semibold text-muted-foreground tabular-nums">
                    {entry.total_points} pts
                  </p>
                  <div
                    className={`w-full rounded-t-xl bg-gradient-to-b ${cfg.bg} border-x border-t ${cfg.border} ${cfg.platformH} flex items-center justify-center shadow-sm`}
                  >
                    <span className={`text-xl font-black ${cfg.numColor}`}>
                      {cfg.displayRank}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 4th+ list */}
        {rest.length > 0 && (
          <div className="border-t pt-3 space-y-0.5">
            {rest.map((entry, i) => {
              const school = getSchool(entry);
              const rank = i + 4;
              return (
                <button
                  key={entry.school_id}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  onClick={() =>
                    school &&
                    onSelectSchool({
                      id: school.school_id,
                      name: school.school.name,
                      totalPoints: entry.total_points,
                      rank,
                    })
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
                      {rank}
                    </span>
                    <span className="font-medium text-sm">
                      {formatSchoolName(school?.school.name)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                    {entry.total_points} pts
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
