"use client";

import { RaidTeam } from "@/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileCheck } from "lucide-react";

interface DocumentsSummaryCardProps {
  team: RaidTeam;
}

const ParticipantDocs = ({
  firstname,
  validated,
  total,
}: {
  firstname: string;
  validated: number;
  total: number;
}) => {
  const pct = total > 0 ? (validated / total) * 100 : 0;
  const isComplete = total > 0 && validated === total;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{firstname}</span>
        <span
          className={
            isComplete
              ? "text-emerald-700 dark:text-emerald-400 font-medium"
              : "text-muted-foreground"
          }
        >
          {validated} / {total} validés
        </span>
      </div>
      <Progress
        value={pct}
        className="[&>div]:bg-emerald-600 dark:[&>div]:bg-emerald-500"
      />
    </div>
  );
};

export const DocumentsSummaryCard = ({ team }: DocumentsSummaryCardProps) => {
  const captain = team.captain;
  const second = team.second;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-700 dark:text-sky-400">
            <FileCheck className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Suivi de la validation des documents de chaque participant.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ParticipantDocs
          firstname={captain.user.firstname}
          validated={captain.number_of_validated_document}
          total={captain.number_of_document}
        />
        {second && (
          <ParticipantDocs
            firstname={second.user.firstname}
            validated={second.number_of_validated_document}
            total={second.number_of_document}
          />
        )}
      </CardContent>
    </Card>
  );
};
