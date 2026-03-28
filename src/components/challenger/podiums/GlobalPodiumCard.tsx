"use client";

import { SchoolResult } from "@/src/api/hyperionSchemas";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Trophy } from "lucide-react";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

interface GlobalPodiumCardProps {
  results: SchoolResult[];
  title: string;
}

const PODIUM_CONFIG = [
  {
    displayRank: 2,
    sourceIndex: 1,
    medal: "🥈",
    platformH: "h-20",
    bg: "from-slate-200 to-slate-100",
    border: "border-slate-300",
    numColor: "text-slate-500",
  },
  {
    displayRank: 1,
    sourceIndex: 0,
    medal: "🥇",
    platformH: "h-28",
    bg: "from-yellow-300 to-amber-200",
    border: "border-yellow-400",
    numColor: "text-yellow-700",
  },
  {
    displayRank: 3,
    sourceIndex: 2,
    medal: "🥉",
    platformH: "h-14",
    bg: "from-orange-300 to-orange-200",
    border: "border-orange-400",
    numColor: "text-orange-700",
  },
];

export function GlobalPodiumCard({ results, title }: GlobalPodiumCardProps) {
  const { sportSchools } = useSportSchools();

  const sorted = [...results]
    .sort((a, b) => b.total_points - a.total_points)
    .map((result, index) => ({ ...result, rank: index + 1 }));

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const getSchoolName = (schoolId: string) => {
    const school = sportSchools?.find((s) => s.school_id === schoolId);
    return formatSchoolName(school?.school.name) || "École inconnue";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p>Aucun résultat disponible pour ce podium.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Visual podium — 2nd | 1st | 3rd */}
            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-3 pt-4 pb-2">
                {PODIUM_CONFIG.map((cfg) => {
                  const entry = top3[cfg.sourceIndex];
                  if (!entry)
                    return (
                      <div
                        key={cfg.displayRank}
                        className="flex-1 max-w-[140px]"
                      />
                    );
                  return (
                    <div
                      key={cfg.displayRank}
                      className="flex-1 max-w-[140px] flex flex-col items-center gap-1"
                    >
                      <span className="text-3xl">{cfg.medal}</span>
                      <p className="text-sm font-bold text-center leading-tight px-1 line-clamp-2">
                        {getSchoolName(entry.school_id)}
                      </p>
                      <p className="text-xs font-semibold text-muted-foreground tabular-nums">
                        {entry.total_points} pts
                      </p>
                      <div
                        className={`w-full rounded-t-xl bg-gradient-to-b ${cfg.bg} border-x border-t ${cfg.border} ${cfg.platformH} flex items-center justify-center shadow-sm`}
                      >
                        <span
                          className={`text-2xl font-black ${cfg.numColor}`}
                        >
                          {cfg.displayRank}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4th+ list */}
            {rest.length > 0 && (
              <div className="border-t pt-3 space-y-0.5">
                {rest.map((entry) => (
                  <div
                    key={entry.school_id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                        {entry.rank}
                      </span>
                      <span className="font-medium text-sm">
                        {getSchoolName(entry.school_id)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                      {entry.total_points} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
