import { ParticipantInfoTab } from "./ParticipantInfoTab";

import { RaidTeam } from "@/api";

import { Card, CardContent } from "@/components/ui/card";

interface InformationTabProps {
  team: RaidTeam;
}

export const InformationTab = ({ team }: InformationTabProps) => {
  return (
    <div className="grid xl:grid-cols-2 gap-4 w-full py-6 grid-cols-1 max-md:p-8 max-md:gap-4">
      <ParticipantInfoTab participant={team.captain} />
      {team.second ? (
        <ParticipantInfoTab participant={team.second} />
      ) : (
        <Card className="w-full h-full">
          <CardContent className="w-full h-full mt-3">
            <span className="flex m-auto h-full justify-center items-center text-muted-foreground">
              {"Aucun coéquipier n'a été ajouté à cette équipe."}
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
