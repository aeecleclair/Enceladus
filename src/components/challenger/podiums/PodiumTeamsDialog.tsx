"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { TeamSportResultComplete } from "@/src/api/hyperionSchemas";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { Medal, Trophy, Award } from "lucide-react";

interface PodiumTeamsDialogProps {
  results: TeamSportResultComplete[];
  sportName: string;
  triggerText?: string;
}

export const PodiumTeamsDialog: React.FC<PodiumTeamsDialogProps> = ({
  results,
  sportName,
  triggerText = "Voir tous les classements",
}) => {
  const { sportSchools } = useSportSchools();

  const getSchoolName = (schoolId: string) => {
    const school = sportSchools?.find((s) => s.school_id === schoolId);
    return formatSchoolName(school?.school.name) || "École inconnue";
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <div className="w-5 h-5 flex items-center justify-center text-xs font-semibold text-gray-600 border rounded-full">
            {rank}
          </div>
        );
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-amber-100 to-amber-50 border-amber-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Classement complet - {sportName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {results
            .sort((a, b) => a.rank - b.rank)
            .map((result) => (
              <div
                key={result.team_id}
                className={`p-4 rounded-lg border ${getRankBackground(result.rank)} flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(result.rank)}
                  <div>
                    <div className="font-semibold text-gray-900">
                      {result.team.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getSchoolName(result.school_id)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {result.points} pts
                  </div>
                  <div className="text-xs text-gray-500">
                    {result.rank === 1
                      ? "1ère place"
                      : result.rank === 2
                        ? "2ème place"
                        : result.rank === 3
                          ? "3ème place"
                          : `${result.rank}ème place`}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
