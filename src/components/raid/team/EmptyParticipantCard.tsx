"use client";

import { RaidTeam } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InviteLinkDialog } from "./InviteLinkDialog";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface EmptyParticipantCardProps {
  team?: RaidTeam;
}

export const EmptyParticipantCard = ({ team }: EmptyParticipantCardProps) => {
  const t = useTranslations("raid.team.empty");
  const [open, setOpen] = useState(false);

  return (
    <Card className="w-full min-h-90 border-dashed border-border/70 bg-muted/15 shadow-sm">
      <CardContent className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm ring-1 ring-border/60">
          <UserPlus className="h-6 w-6" />
        </div>
        <div className="max-w-sm space-y-1">
          <p className="font-semibold tracking-tight">
            {t("title")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => setOpen(true)}
          disabled={!team}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {t("invite")}
        </Button>
      </CardContent>
      {team && (
        <InviteLinkDialog open={open} onOpenChange={setOpen} teamId={team.id} />
      )}
    </Card>
  );
};
