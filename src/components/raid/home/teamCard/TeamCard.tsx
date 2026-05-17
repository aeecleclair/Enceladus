"use client";

import { RaidTeam } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useEdition } from "@/hooks/raid/useEdition";
import {
  difficulties,
  difficultyDescriptions,
  getLabelFromValue,
  meetingPlaces,
} from "@/lib/raid/comboboxValues";
import { formatDateRange, getDaysLeft } from "@/lib/dateFormat";
import { Calendar, MapPin, Pencil, X } from "lucide-react";
import { useState } from "react";
import { TeamEdit } from "./TeamEdit";

interface TeamCardProps {
  team?: RaidTeam;
}

export const TeamCard = ({ team }: TeamCardProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const { edition } = useEdition();

  if (!team) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-3 w-full" />
        </CardContent>
      </Card>
    );
  }

  const registeringEndDate = edition?.registering_end_date;
  const daysLeft = registeringEndDate ? getDaysLeft(registeringEndDate) : null;
  const progress = team.validation_progress ?? 0;

  const difficultyLabel = team.difficulty
    ? getLabelFromValue(difficulties, team.difficulty)
    : "Parcours à choisir";
  const difficultyDescription = team.difficulty
    ? getLabelFromValue(difficultyDescriptions, team.difficulty)
    : null;
  const difficultyClass: string = (() => {
    switch (team.difficulty) {
      case "discovery":
        return "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900";
      case "sports":
        return "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900";
      case "expert":
        return "bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900";
      default:
        return "";
    }
  })();
  const meetingLabel = team.meeting_place
    ? getLabelFromValue(meetingPlaces, team.meeting_place)
    : "Lieu à choisir";
  const datesLabel =
    edition?.start_date && edition?.end_date
      ? formatDateRange(edition.start_date, edition.end_date)
      : null;

  return (
    <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl tracking-tight">
              {isEdit ? "Éditer l'équipe" : team.name}
            </CardTitle>
            {!isEdit && (
              <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                {datesLabel && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {datesLabel}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {meetingLabel}
                </span>
              </CardDescription>
            )}
          </div>
          <Button
            variant={isEdit ? "ghost" : "outline"}
            size="sm"
            onClick={() => setIsEdit((v) => !v)}
          >
            {isEdit ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Annuler
              </>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Éditer
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isEdit ? (
          <TeamEdit team={team} setIsEdit={setIsEdit} />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={team.difficulty ? "outline" : "secondary"}
                className={`gap-1 ${difficultyClass}`}
              >
                {difficultyLabel}
                {difficultyDescription ? ` — ${difficultyDescription}` : ""}
              </Badge>
              {daysLeft !== null && daysLeft >= 0 && daysLeft > 7 && (
                <Badge variant="outline">
                  {`${daysLeft} jours avant clôture`}
                </Badge>
              )}
              {daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && (
                <Badge className="bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
                  {daysLeft === 0
                    ? "Dernier jour pour s'inscrire"
                    : `${daysLeft} jour${daysLeft > 1 ? "s" : ""} avant clôture`}
                </Badge>
              )}
              {daysLeft !== null && daysLeft < 0 && (
                <Badge variant="destructive">Inscriptions fermées</Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Progression de l&apos;inscription
                </span>
                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                  {progress.toFixed(0)}%
                </span>
              </div>
              <Progress
                value={progress}
                className="[&>div]:bg-emerald-600 dark:[&>div]:bg-emerald-500"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
