import { ParticipantInfoTab } from "./ParticipantInfoTab";

import { RaidTeamComplete } from "@/api";

import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";

interface InformationTabProps {
  team: RaidTeamComplete;
}

export const InformationTab = ({ team }: InformationTabProps) => {
  const t = useTranslations("raid.admin.teams");

  return (
    <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
      <ParticipantInfoTab participant={team.captain} />
      {team.second ? (
        <ParticipantInfoTab participant={team.second} />
      ) : (
        <Card className="flex min-h-50 items-center justify-center border-dashed border-border/60 bg-muted/10">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            {t("noTeammateAdded")}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
