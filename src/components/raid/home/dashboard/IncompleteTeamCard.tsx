"use client";
import { RaidTeam } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "@/i18n/navigation";
import { ArrowRight, ClipboardList } from "lucide-react";

interface IncompleteTeamCardProps {
  team?: RaidTeam;
}

export const IncompleteTeamCard = ({ team }: IncompleteTeamCardProps) => {
  const router = useRouter();
  const progress = team?.validation_progress ?? 0;
  const hasTeammate = !!team?.second;

  return (
    <Card className="mx-auto w-full max-w-3xl border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <CardTitle>Votre inscription avance</CardTitle>
            <CardDescription>
              {hasTeammate
                ? "Finalisez les documents et le paiement pour valider votre dossier."
                : "Invitez un coéquipier et complétez les informations de l'équipe."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              {progress.toFixed(0)}%
            </span>
          </div>
          <Progress
            value={progress}
            className="[&>div]:bg-emerald-600 dark:[&>div]:bg-emerald-500"
          />
        </div>
        <Button className="w-full" onClick={() => router.push("/team")}>
          Aller à mon équipe
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
