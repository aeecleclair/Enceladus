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
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {participant.user.firstname + " " + participant.user.name}
        </CardTitle>
        <CardDescription>
          dossier particiant completé à{" "}
          {participant.validation_progress.toFixed(0)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ParticipantInfo
          label="Date de naissance"
          value={
            participant.user.birthday
              ? formatDate(participant.user.birthday)
              : "Non renseigné"
          }
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
