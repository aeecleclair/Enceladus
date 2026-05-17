"use client";
import { RaidEdition } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { getDaysLeft } from "@/lib/dateFormat";
import { CheckCircle2, Users } from "lucide-react";

interface FullyRegisteredDashboardProps {
  edition?: RaidEdition;
}

export const FullyRegisteredDashboard = ({
  edition,
}: FullyRegisteredDashboardProps) => {
  const router = useRouter();
  const daysLeft = edition?.start_date ? getDaysLeft(edition.start_date) : null;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <Card className="border-green-600/30 bg-green-50/60 shadow-sm dark:bg-green-950/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/10 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Inscription validée</CardTitle>
              <CardDescription>
                Votre dossier est complet. Rendez-vous au départ du Raid !
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {daysLeft !== null && daysLeft >= 0 && (
        <Card className="shadow-sm">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl font-bold tracking-tight">{daysLeft}</div>
            <div className="text-sm text-muted-foreground mt-2">
              jour{daysLeft > 1 ? "s" : ""} avant le départ
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        variant="outline"
        className="w-full shadow-sm"
        onClick={() => router.push("/team")}
      >
        <Users className="mr-2 h-4 w-4" />
        Voir mon équipe
      </Button>
    </div>
  );
};
