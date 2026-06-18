import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CalendarDays } from "lucide-react";

export const EditionWaitingCard = () => {
  return (
    <Card className="mx-auto w-full max-w-3xl border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <CalendarDays className="h-5 w-5" />
          </div>
          <CardTitle>En attente de la prochaine édition</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          La prochaine édition du Raid sera bientôt annoncée. Revenez plus tard
          pour vous inscrire.
        </p>
      </CardContent>
    </Card>
  );
};
