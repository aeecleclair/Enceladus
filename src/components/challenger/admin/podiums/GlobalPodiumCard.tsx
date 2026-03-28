"use client";

import { SchoolResult } from "@/src/api/hyperionSchemas";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { useSchools } from "@/src/hooks/useSchools";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

interface GlobalPodiumCardProps {
  results: SchoolResult[];
  title: string;
}

export function GlobalPodiumCard({ results, title }: GlobalPodiumCardProps) {
  const { sportSchools } = useSportSchools();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <span className="h-6 w-6 flex items-center justify-center text-sm font-bold">
            {rank}
          </span>
        );
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50 border-yellow-200";
      case 2:
        return "bg-gray-50 border-gray-200";
      case 3:
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  // Sort by total_points descending and assign ranks
  const sortedResults = [...results]
    .sort((a, b) => b.total_points - a.total_points)
    .map((result, index) => ({ ...result, rank: index + 1 }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedResults.length > 0 ? (
            sortedResults.map((result) => {
              const school = sportSchools?.find(
                (s) => s.school_id === result.school_id,
              );
              return (
                <div
                  key={result.school_id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${getRankColor(result.rank)}`}
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(result.rank)}
                    <div>
                      <p className="font-semibold">
                        {formatSchoolName(school?.school.name) ||
                          "École inconnue"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {result.total_points} pts
                    </p>
                    <p className="text-sm text-muted-foreground">
                      #{result.rank}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucun résultat disponible pour ce podium.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
