"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { usePodiums } from "../../../hooks/usePodiums";
import { useSports } from "../../../hooks/useSports";
import { Medal, Trophy, Award } from "lucide-react";
import { formatSchoolName } from "../../../utils/schoolFormatting";

interface MockResult {
  team_id: string;
  team: { name: string };
  sport_id: string;
  rank: number;
  points: number;
}

interface SchoolStandingsDialogProps {
  schoolId: string;
  schoolName: string;
  totalPoints: number;
  rank: number;
  onClose: () => void;
  mockResults?: MockResult[];
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-4 h-4 text-yellow-500" />;
    case 2:
      return <Medal className="w-4 h-4 text-gray-400" />;
    case 3:
      return <Award className="w-4 h-4 text-amber-600" />;
    default:
      return (
        <div className="w-4 h-4 flex items-center justify-center text-xs font-semibold text-gray-600 border rounded-full">
          {rank}
        </div>
      );
  }
};

const getRankBg = (rank: number) => {
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

export default function SchoolStandingsDialog({
  schoolId,
  schoolName,
  totalPoints,
  rank,
  onClose,
  mockResults,
}: SchoolStandingsDialogProps) {
  const { schoolPodium } = usePodiums({ schoolId });
  const { sports } = useSports();
  const results = mockResults ?? schoolPodium;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div
          className={`h-1.5 w-full ${rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : rank === 3 ? "bg-amber-600" : "bg-blue-500"}`}
        />

        <div className="px-6 pt-4 pb-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="flex items-start justify-between gap-3">
              <span className="text-lg leading-tight">
                {formatSchoolName(schoolName)}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0 pt-0.5 text-sm font-semibold">
                {getRankIcon(rank)}
                <span>{totalPoints} pts</span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            {results && results.length > 0 ? (
              results
                .sort((a, b) => a.rank - b.rank)
                .map((result) => {
                  const sportName =
                    sports?.find((s) => s.id === result.sport_id)?.name ||
                    "Sport";
                  return (
                    <div
                      key={result.team_id}
                      className={`p-3 rounded-lg border ${getRankBg(result.rank)} flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        {getRankIcon(result.rank)}
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {result.team.name}
                          </div>
                          <div className="text-xs text-gray-500">{sportName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-gray-900">
                          {result.points} pts
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.rank === 1
                            ? "1ère place"
                            : `${result.rank}ème place`}
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun résultat disponible
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
