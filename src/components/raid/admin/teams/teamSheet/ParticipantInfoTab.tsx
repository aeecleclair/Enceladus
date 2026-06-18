import { RaidParticipant } from "@/api";
import { ParticipantInfo } from "@/components/raid/custom/ParticipantInfo";
import { formatDate } from "@/lib/dateFormat";
import { getLabelFromValue, situations } from "@/lib/raid/comboboxValues";
import { getSituationLabel, getSituationTitle } from "@/lib/raid/teamUtils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ParticipantInfoTabProps {
  participant: RaidParticipant;
}

export const ParticipantInfoTab = ({
  participant,
}: ParticipantInfoTabProps) => {
  function getSituation(participant: RaidParticipant) {
    const situation = getSituationLabel(participant.situation ?? undefined);
    const title = getSituationTitle(participant.situation ?? undefined);
    return (
      <>
        <ParticipantInfo
          label="Situation"
          value={getLabelFromValue(situations, situation)}
        />
        {situation === "otherschool" && (
          <ParticipantInfo label="Nom de l'école" value={title} />
        )}
        {situation === "corporatepartner" && (
          <ParticipantInfo label="Nom de l'entreprise" value={title} />
        )}
        {situation === "other" && (
          <ParticipantInfo label="Autre situation" value={title} />
        )}
      </>
    );
  }
  const participantProgress = participant.validation_progress ?? 0;
  const participantProgressClass =
    participantProgress === 100
      ? "text-emerald-700 dark:text-emerald-400"
      : participantProgress >= 50
        ? "text-amber-700 dark:text-amber-400"
        : "text-muted-foreground";
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>
          {participant.user.firstname + " " + participant.user.name}
        </CardTitle>
        <CardDescription>
          Dossier participant complété à{" "}
          <span className={`font-semibold ${participantProgressClass}`}>
            {participantProgress.toFixed(0)}%
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ParticipantInfo
          label="Date de naissance"
          value={formatDate(participant.user.birthday)}
        />
        <ParticipantInfo label="Email" value={participant.user.email} />
        <ParticipantInfo label="Adresse" value={participant.address} />
        <ParticipantInfo label="Taille de vélo" value={participant.bike_size} />
        <ParticipantInfo
          label="Taille de t-shirt"
          value={participant.t_shirt_size}
        />
        <ParticipantInfo label="Régime alimentaire" value={participant.diet} />
        {getSituation(participant)}
        <ParticipantInfo
          label="Attestation sur l'honneur"
          value={participant.attestation_on_honour}
        />
      </CardContent>
    </Card>
  );
};
