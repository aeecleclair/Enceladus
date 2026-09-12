import { RaidParticipant } from "@/api";
import { ParticipantInfo } from "@/components/raid/custom/ParticipantInfo";
import { formatDate } from "@/lib/dateFormat";
import { getLabelFromValue, situations } from "@/lib/raid/comboboxValues";
import { getSituationLabel, getSituationTitle } from "@/lib/raid/teamUtils";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("raid.admin.teams.participantTab");

  function getSituation(participant: RaidParticipant) {
    const situation = getSituationLabel(participant.situation ?? undefined);
    const title = getSituationTitle(participant.situation ?? undefined);
    return (
      <>
        <ParticipantInfo
          label={t("situation")}
          value={getLabelFromValue(situations, situation)}
        />
        {situation === "otherschool" && (
          <ParticipantInfo label={t("schoolName")} value={title} />
        )}
        {situation === "corporatepartner" && (
          <ParticipantInfo label={t("companyName")} value={title} />
        )}
        {situation === "other" && (
          <ParticipantInfo label={t("otherSituation")} value={title} />
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
          {t("progressLabel")}{" "}
          <span className={`font-semibold ${participantProgressClass}`}>
            {participantProgress.toFixed(0)}%
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ParticipantInfo
          label={t("birthday")}
          value={formatDate(participant.user.birthday)}
        />
        <ParticipantInfo label={t("email")} value={participant.user.email} />
        <ParticipantInfo label={t("address")} value={participant.address} />
        <ParticipantInfo label={t("bikeSize")} value={participant.bike_size} />
        <ParticipantInfo
          label={t("tShirtSize")}
          value={participant.t_shirt_size}
        />
        <ParticipantInfo label={t("diet")} value={participant.diet} />
        {getSituation(participant)}
        <ParticipantInfo
          label={t("scholarship")}
          value={participant.has_scholarship}
        />
        {participant.has_scholarship && (
          <ParticipantInfo
            label={t("scholarshipAttestation")}
            value={participant.school_authorization}
            participantId={participant.user_id}
          />
        )}
        <ParticipantInfo
          label={t("honourAttestation")}
          value={participant.attestation_on_honour}
        />
      </CardContent>
    </Card>
  );
};
