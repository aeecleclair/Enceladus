"use client";

import { TeamSportResultComplete } from "@/src/api/hyperionSchemas";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

interface PodiumCardProps {
  results: TeamSportResultComplete[];
  title: string;
}

export function PodiumCard({ results, title }: PodiumCardProps) {
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

  const sortedResults = [...results].sort((a, b) => a.rank - b.rank);

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
            sortedResults.map((result) => (
              <div
                key={`${result.team_id}-${result.school_id}`}
                className={`flex items-center justify-between p-3 rounded-lg border ${getRankColor(result.rank)}`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(result.rank)}
                  <div>
                    <p className="font-semibold">{result.team.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Équipe ID: {result.team_id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{result.points} pts</p>
                  <p className="text-sm text-muted-foreground">
                    #{result.rank}
                  </p>
                </div>
              </div>
            ))
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
