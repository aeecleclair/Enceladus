import { ParticipantInfoTab } from "./ParticipantInfoTab";

import { RaidTeam } from "@/api";

import { Card, CardContent } from "@/components/ui/card";

interface InformationTabProps {
  team: RaidTeam;
}

export const InformationTab = ({ team }: InformationTabProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
      <ParticipantInfoTab participant={team.captain} />
      {team.second ? (
        <ParticipantInfoTab participant={team.second} />
      ) : (
        <Card className="flex min-h-[200px] items-center justify-center border-dashed border-border/60 bg-muted/10">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Aucun coéquipier n&apos;a été ajouté à cette équipe.
          </CardContent>
        </Card>
      )}
    </div>
  );
};
